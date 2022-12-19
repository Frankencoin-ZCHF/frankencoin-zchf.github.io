<template>
  <AppPageHeader
    title="Borrow ZCHF"
    backText="Back to position"
    :backTo="'/position/detail/' + address"
  />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm v-if="!loading">
        <div class="space-y-8">
          <SwapFieldInput
            v-model.number="amount"
            label="Borrow"
            :max="borrowingLimit"
            :hideMaxLabel="true"
            :fromWallet="false"
            :displayMaxButton="true"
            symbol="ZCHF"
          />

          <SwapFieldOutput
            :result="result"
            label="Required collateral"
            :max="auth.user.tokens[position.collateralAddress]?.amount"
            :showWallet="true"
            :symbol="position.collateral.symbol"
          />

          <div class="flex flex-col gap-2">
            <div class="flex">
              <div class="flex-1">Paid to your wallet</div>
              <div>{{ formatCurrency(paidOutToWallet) }} ZCHF</div>
            </div>

            <div class="flex">
              <div class="flex-1">Locked in borrowers reserve</div>
              <div>{{ formatCurrency(borrowersReserveContribution) }} ZCHF</div>
            </div>

            <div class="flex">
              <div class="flex-1">Fees</div>
              <div>{{ formatCurrency(fees) }} ZCHF</div>
            </div>

            <hr />

            <div class="flex font-bold">
              <div class="flex-1">Total</div>
              <div>{{ formatCurrency(amount) }} ZCHF</div>
            </div>
          </div>
        </div>
      </AppForm>
      <AppLoading v-else />
    </AppBox>
  </section>
</template>

<script setup>
import { computed, ref, inject, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { addresses } from '@/contracts/dictionnary';
import config from '@/config';

import usePositionsRepository from '@/repositories/usePositionsRepository';
import useCollateralsRepository from '@/repositories/useCollateralsRepository';

import collateralApprove from '@/transactions/collateralApprove';
import clonePosition from '@/transactions/clonePosition';

import { formatCurrency } from '@/utils/formatNumber';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppForm from '@/components/AppForm.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import SwapFieldOutput from '@/components/SwapFieldOutput.vue';

const auth = inject('auth');
const reload = inject('reload');
const loading = inject('loading');

const router = useRouter();
const route = useRoute();
const address = route.params.address;

const positionsRepository = usePositionsRepository();
const collateralsRepository = useCollateralsRepository();

const position = computed(() => positionsRepository.getOne(address));

const amount = ref();

const result = computed(() => {
  if (!isNaN(amount.value) && position.value?.price)
    return amount.value / position.value.price;
  return 0;
});

const allowed = computed(() => {
  const allowedAmount = position.value.collateral.allowedAmountMintingHub;

  return amount.value ? allowedAmount >= result.value : allowedAmount > 0;
});

const pending = ref(false);

const availableAmount = computed(() => {
  return position.value.limit - position.value.minted;
});

const userValue = computed(() => {
  return (
    auth.user.tokens[position.value.collateralAddress]?.amount *
    position.value.price
  );
});

const borrowingLimit = computed(() => {
  return Math.min(availableAmount.value, userValue.value);
});

const isBorrowingLimitFromWallet = computed(
  () => availableAmount.value > userValue.value
);

const fees = computed(() => {
  return (position.value.mintingFeePPM * amount.value) / 1000000;
});

const borrowersReserveContribution = computed(
  () => (position.value.reserveContribution * amount.value) / 1000000
);

const paidOutToWallet = computed(
  () => amount.value - borrowersReserveContribution.value - fees.value
);

const disabled = computed(() => !amount.value);

const error = computed(() => {
  if (position.value.isOwningPosition) {
    return {
      message: 'You cannot clone your own position.',
    };
  } else if (amount.value < 0) {
    return {
      message: 'Cannot place a challenge with negative amount.',
    };
  } else if (amount.value > borrowingLimit.value) {
    if (isBorrowingLimitFromWallet.value) {
      return {
        message: `Not enough ${position.value.collateral.symbol} in your Wallet`,
      };
    } else {
      return {
        message: `Not enough ZCHF available for this position.`,
      };
    }
  }

  return null;
});

const allow = async () => {
  pending.value = true;
  const amountToApprove = 20000000000000;

  await collateralApprove(
    position.value.collateral.address,
    addresses.mintingHub,
    amountToApprove
  );

  pending.value = false;

  collateralsRepository
    .where('address', position.value.collateral.address)
    .update({ allowedAmountMintingHub: amountToApprove });
};

const submit = async () => {
  pending.value = true;

  const tx = await clonePosition(address, result, amount);

  if (!tx.error) {
    const txReceipt = await config.provider.getTransactionReceipt(tx.hash);
    const newPositionAddress = txReceipt.logs[5].address;

    await reload();

    router.push({
      name: 'positionDetail',
      params: { address: newPositionAddress },
    });
  }

  pending.value = false;
};

provide('pending', pending);
provide('needsAllowance', true);
provide('disabled', disabled);
provide('allowed', allowed);
provide('error', error);
provide('allow', allow);
provide('submit', submit);
</script>
