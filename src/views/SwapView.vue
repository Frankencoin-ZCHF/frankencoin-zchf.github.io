<template>
  <AppPageHeader title="Swap XCHF and ZCHF" />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm class="space-y-4" v-if="!loading">
        <SwapFieldInput
          v-model="amount"
          :max="from.max"
          :symbol="from.symbol"
          :limit="swapLimit"
          limitLabel="Swap limit"
          :error="error"
        />

        <div class="pt-4 text-center">
          <AppButton
            :class="{ 'rotate-180': isReversed }"
            tag="button"
            type="button"
            icon="Swap"
            iconOnly
            rounded
            secondary
            @click="switchDirection"
          />
        </div>

        <SwapFieldOutput
          :result="result"
          :max="to.max"
          :showWallet="true"
          :symbol="to.symbol"
          :note="conversionNote"
        />
      </AppForm>
      <AppLoading v-else />
    </AppBox>
  </section>
</template>

<script setup>
import AppBox from '@/components/AppBox.vue';
import AppButton from '@/components/AppButton.vue';
import AppForm from '@/components/AppForm.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import SwapFieldOutput from '@/components/SwapFieldOutput.vue';
import useSwapBox from '@/composables/useSwapBox';
import { addresses } from '@/contracts/dictionnary';
import useUsersRepository from '@/repositories/useUsersRepository';
import allowXchf from '@/transactions/allowXchf';
import mintXchf from '@/transactions/mintXchf';
import mintZchf from '@/transactions/mintZchf';
import { bigNumberCompare } from '@/utils/math';
import { computed, inject, provide, ref } from 'vue';

const stablecoin = inject('stablecoin');
const frankencoin = inject('frankencoin');
const auth = inject('auth');
const reload = inject('reload');
const loading = inject('loading');

const UsersRepository = useUsersRepository();

const amount = ref();

const result = computed(() => amount.value);

const disabled = computed(() => !parseFloat(amount.value));

const pending = ref(false);

const allowed = computed(() => {
  const allowedAmount = auth.user.XCHFBridgeAllowance;

  if (isReversed.value) {
    return disabled.value
      ? bigNumberCompare('>', allowedAmount, 0)
      : bigNumberCompare('>=', auth.user.XCHFBridgeAllowance, amount.value);
  } else {
    return true;
  }
});

const conversionNote = computed(() => {
  return `1 ${from.value.symbol} = 1 ${to.value.symbol}`;
});

const swapLimit = computed(() =>
  isReversed.value ? stablecoin.value.bridgeBalance : stablecoin.value.available
);

const currencyA = ref({
  symbol: stablecoin.value.symbol,
  placeholder: `${stablecoin.value.symbol} amount`,
  label: 'Send',
  max: computed(() => auth.user.XCHF),
  decimals: stablecoin.value.decimals,

  transaction: async () => {
    pending.value = true;

    const tx = await mintZchf(amount);

    pending.value = false;

    if (!tx.error) {
      amount.value = '0';
      await reload();
    }
  },
});

const currencyB = ref({
  symbol: frankencoin.value.symbol,
  placeholder: `${frankencoin.value.symbol} amount`,
  label: 'Send',
  max: computed(() => auth.user.ZCHF),
  decimals: frankencoin.value.decimals,

  transaction: async () => {
    pending.value = true;

    const tx = await mintXchf(amount);

    pending.value = false;

    if (!tx.error) {
      amount.value = '0';
      await reload();
    }
  },
});

const { from, to, isReversed, switchDirection } = useSwapBox({
  currencyA,
  currencyB,
  amount,
});

const error = computed(() => {
  if (bigNumberCompare('<', amount.value, 0)) {
    return {
      message: 'Cannot swap a negative amount.',
    };
  } else if (bigNumberCompare('>', amount.value, from.value.max)) {
    return {
      message: `Not enough ${from.value.symbol} in your wallet.`,
    };
  } else if (bigNumberCompare('>', amount.value, swapLimit.value)) {
    return {
      message: `Not enough ${to.value.symbol} available to swap.`,
    };
  }

  return null;
});

const allow = async () => {
  pending.value = true;
  const amountToApprove = '2000000';

  await allowXchf(addresses.bridge, amountToApprove);

  pending.value = false;

  UsersRepository.where('address', auth.user.address).update({
    XCHFBridgeAllowance: amountToApprove,
  });
};

provide('disabled', disabled);
provide('needsAllowance', !isReversed.value);
provide('allowed', allowed);
provide('pending', pending);
provide('error', error);
provide('allow', allow);
provide(
  'submit',
  computed(() => from.value.transaction)
);
</script>
