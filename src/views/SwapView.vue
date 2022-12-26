<template>
  <AppPageHeader title="Swap XCHF and ZCHF" />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm v-if="!loading">
        <SwapFieldInput
          v-model.number="amount"
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
import { computed, ref, inject, provide } from 'vue';
import { addresses } from '@/contracts/dictionnary';

import useSwapBox from '@/composables/useSwapBox';

import mintZchf from '@/transactions/mintZchf';
import mintXchf from '@/transactions/mintXchf';
import allowXchf from '@/transactions/allowXchf';

import useUsersRepository from '@/repositories/useUsersRepository';

import SwapFieldInput from '@/components/SwapFieldInput.vue';
import SwapFieldOutput from '@/components/SwapFieldOutput.vue';
import AppButton from '@/components/AppButton.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppForm from '@/components/AppForm.vue';

const stablecoin = inject('stablecoin');
const auth = inject('auth');
const reload = inject('reload');
const loading = inject('loading');

const UsersRepository = useUsersRepository();

const amount = ref(0);

const result = computed(() => amount.value);

const disabled = computed(() => !amount.value);

const pending = ref(false);

const allowed = computed(() =>
  isReversed.value ? true : auth.user.XCHFBridgeAllowance > amount.value
);

const conversionNote = computed(() => {
  return `1 ${from.value.symbol} = 1 ${to.value.symbol}`;
});

const swapLimit = computed(() =>
  isReversed.value ? stablecoin.value.bridgeBalance : stablecoin.value.available
);

const currencyA = ref({
  symbol: 'XCHF',
  placeholder: 'XCHF amount',
  label: 'Send',
  max: computed(() => auth.user.XCHF),

  transaction: async () => {
    pending.value = true;

    await mintZchf(amount);

    pending.value = false;

    amount.value = 0;

    reload();
  },
});

const currencyB = ref({
  symbol: 'ZCHF',
  placeholder: 'ZCHF amount',
  label: 'Send',
  max: computed(() => auth.user.ZCHF),

  transaction: async () => {
    pending.value = true;

    await mintXchf(amount);

    pending.value = false;

    amount.value = 0;

    reload();
  },
});

const { from, to, isReversed, switchDirection } = useSwapBox({
  currencyA,
  currencyB,
  amount,
});

const error = computed(() => {
  if (amount.value < 0) {
    return {
      message: 'Cannot swap a negative amount.',
    };
  } else if (amount.value > from.value.max) {
    return {
      message: `Not enough ${from.value.symbol} in your wallet.`,
    };
  } else if (amount.value > swapLimit.value) {
    return {
      message: `Not enough ${to.value.symbol} available to swap.`,
    };
  }

  return null;
});

const allow = async () => {
  pending.value = true;
  const amountToApprove = 20000000000000;

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
