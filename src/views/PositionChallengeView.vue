<template>
  <AppPageHeader
    subtitle="Place Challenge"
    backText="Back to position"
    :backTo="'/position/detail/' + address"
  />

  <section class="container m-auto max-w-2xl">
    <AppBox>
      <AppForm v-if="!loading">
        <SwapFieldInput
          v-model.number="amount"
          label="Amount"
          :max="maxAmount"
          :customMaxAmount="
            auth.user.tokens[position.collateralAddress]?.amount
          "
          :showWallet="true"
          :symbol="position.collateral.symbol"
        />
        <div class="my-8 flex flex-col gap-2">
          <div class="flex">
            <div class="flex-1">Buy now price</div>
            <div>{{ formatCurrency(position.price) }} ZCHF</div>
          </div>

          <div class="flex">
            <div class="flex-1">Collateral in position</div>
            <div>
              {{ position.collateralBalance }}
              {{ position.collateral.symbol }}
            </div>
          </div>

          <div class="flex">
            <div class="flex-1">Maximum bid</div>
            <div>{{ maximumBid }} ZCHF</div>
          </div>

          <div class="flex">
            <div class="flex-1">
              <span class="font-bold">Auction duration</span>
            </div>
            <div>{{ challengeDuration }}</div>
          </div>

          <div class="mt-4 text-sm">
            <p>The amount you provide will be auctioned publicly.</p>
            <p>This results in the following scenarios for you:</p>

            <ol class="flex flex-col gap-y-2 pl-6 [&>li]:list-decimal">
              <li>
                If the liquidation price for your auction is reached, you get
                your amount back and an additional reward.
              </li>
              <li>
                If the minimum criteria for your auction aren’t met, you will
                receive the highest bid on your amount.
              </li>
              <li>
                If no bids are placed your challenge passes successfully and you
                get your amount back and an additional reward.
              </li>
            </ol>
          </div>
        </div>
      </AppForm>
      <AppLoading v-else />
    </AppBox>
  </section>
</template>

<script setup>
import { ref, computed, inject, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { formatCurrency } from '@/utils/formatNumber';
import { durationFormatter } from '@/utils/date';
import { addresses } from '@/contracts/dictionnary';

import collateralApprove from '@/transactions/collateralApprove';
import launchChallenge from '@/transactions/launchChallenge';

import usePositionsRepository from '@/repositories/usePositionsRepository';
import useCollateralsRepository from '@/repositories/useCollateralsRepository';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppForm from '@/components/AppForm.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';

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

const maxAmount = computed(() =>
  Math.min(
    position.value.collateralBalance,
    auth.user.tokens[position.value.collateralAddress]?.amount
  )
);

const disabled = computed(() => !amount.value);

const allowed = computed(() => {
  const allowedAmount = position.value.collateral.allowedAmountMintingHub;

  return amount.value ? allowedAmount >= amount.value : allowedAmount > 0;
});

const pending = ref(false);

const maximumBid = computed(() =>
  !amount.value ? 0 : formatCurrency(position.value.price * amount.value)
);

const challengeDuration = computed(() =>
  durationFormatter(position.value.challengePeriod)
);

const error = computed(() => {
  if (amount.value < 0) {
    return {
      message: 'Cannot use a negative amount.',
    };
  } else if (amount.value > position.value.collateralBalance) {
    return {
      message:
        'Challenge collateral should not be larger than position collateral.',
    };
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
  const tx = await launchChallenge(address, amount);

  if (!tx.error) {
    await reload();

    router.push({
      name: 'positionDetail',
      params: { address: address },
    });
  }

  pending.value = false;
};

provide('position', position);
provide('disabled', disabled);
provide('needsAllowance', true);
provide('allowed', allowed);
provide('pending', pending);
provide('error', error);
provide('allow', allow);
provide('submit', submit);
</script>
