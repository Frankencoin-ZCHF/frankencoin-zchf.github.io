<template>
  <AppPageHeader
    title="Increase, decrease or change the liquidation risk of your position"
    backText="Back to position"
    :backTo="'/position/detail/' + address"
  />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm v-if="!loading">
        <div class="space-y-12">
          <div class="space-y-4">
            <SwapFieldInput
              v-model.number="mintedInput"
              label="Amount"
              :max="auth.user.ZCHF"
              :limit="repayPosition"
              :fromWallet="true"
              symbol="ZCHF"
            >
              <template v-slot:action>
                <button
                  @click="autoFill('minted')"
                  type="button"
                  title="Auto-fill minted"
                  class="px-2"
                >
                  <IconMagic class="h-5 w-5" />
                </button>
              </template>
            </SwapFieldInput>

            <div class="flex flex-col gap-2">
              <div class="flex">
                <div class="flex-1">Current Amount</div>

                <DisplayAmount
                  :bold="false"
                  :amount="position.minted"
                  currency="ZCHF"
                />
              </div>

              <div class="flex">
                <div class="flex-1">{{ paidOutToWalletLabel }}:</div>

                <DisplayAmount
                  :bold="false"
                  :amount="paidOutToWalletAmount"
                  currency="ZCHF"
                />
              </div>

              <div class="flex">
                <div class="flex-1">{{ reserveContributionLabel }}:</div>

                <DisplayAmount
                  :bold="false"
                  :amount="borrowersReserveContribution"
                  currency="ZCHF"
                />
              </div>

              <div class="flex font-bold" v-if="!isNegativeDifference">
                <div class="flex-1">Fee</div>
                <DisplayAmount :bold="false" :amount="fees" currency="ZCHF" />
              </div>

              <hr />

              <div class="flex font-bold">
                <div class="flex-1">New amount</div>
                <DisplayAmount
                  :bold="false"
                  :amount="mintedInput ? mintedInput : 0"
                  currency="ZCHF"
                />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <SwapFieldInput
              v-model.number="collateralInput"
              label="Collateral"
              :max="auth.user.tokens[position.collateralAddress]?.amount"
              :showWallet="true"
              :symbol="position.collateral.symbol"
              :note="collateralNote"
            >
              <template v-slot:action>
                <button
                  @click="autoFill('collateral')"
                  type="button"
                  title="Auto-fill Collateral"
                  class="px-2"
                >
                  <IconMagic class="h-5 w-5" />
                </button>
              </template>
            </SwapFieldInput>
          </div>

          <div class="space-y-4">
            <SwapFieldInput
              v-model.number="liquidationPriceInput"
              label="Liquidation price"
              :max="position.price"
              :maxInput="false"
              :showWallet="true"
              symbol="ZCHF"
              :note="liquidationPriceNote"
            >
              <template v-slot:action>
                <button
                  @click="autoFill('liquidation')"
                  type="button"
                  title="Auto-fill liquidation price"
                  class="px-2"
                >
                  <IconMagic class="h-5 w-5" />
                </button>
              </template>
            </SwapFieldInput>
          </div>
        </div>
      </AppForm>
      <AppLoading v-else />
    </AppBox>
  </section>
</template>

<script setup>
import { provide, ref, computed, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import usePositionsRepository from '@/repositories/usePositionsRepository';
import useUsersRepository from '@/repositories/useUsersRepository';

import collateralApprove from '@/transactions/collateralApprove';
import adjustPosition from '@/transactions/adjustPosition';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppForm from '@/components/AppForm.vue';
import IconMagic from '@/components/icons/IconMagic.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';

const auth = inject('auth');
const loading = inject('loading');
const reload = inject('reload');

const route = useRoute();
const router = useRouter();

const address = route.params.address;

const usersRepository = useUsersRepository();
const positionsRepository = usePositionsRepository();

const position = computed(() => positionsRepository.getOne(address));

const mintedInput = ref(null);
const collateralInput = ref(null);
const liquidationPriceInput = ref(null);

const pending = ref(false);

const repayPosition = computed(() =>
  Math.max(0, position.value.minted - auth.user.ZCHF)
);

const allowed = computed(() => {
  return auth.user.allowances[address] >= collateralInput.value;
});

const autoFill = (origin) => {
  switch (origin) {
    case 'minted':
      mintedInput.value = collateralInput.value * liquidationPriceInput.value;
      break;
    case 'collateral':
      collateralInput.value = Math.max(
        mintedInput.value / liquidationPriceInput.value,
        position.value.minimumCollateral
      );
      break;
    case 'liquidation':
      liquidationPriceInput.value =
        collateralInput.value === 0
          ? 0
          : mintedInput.value / collateralInput.value;
      break;
  }
};

const additionalAmount = computed(
  () => mintedInput.value - position.value.minted
);

const fees = computed(() =>
  Math.abs((position.value.mintingFeePPM * additionalAmount.value) / 1000000)
);

const borrowersReserveContribution = computed(() =>
  Math.abs(
    (position.value.reserveContribution * additionalAmount.value) / 1000000
  )
);

const isNegativeDifference = computed(() => additionalAmount.value < 0);

const paidOutToWalletLabel = computed(() =>
  isNegativeDifference.value ? 'Taken in wallet' : 'Received in wallet'
);

const paidOutToWalletAmount = computed(() => {
  if (isNegativeDifference.value) {
    return (
      Math.abs(additionalAmount.value + fees.value) -
      borrowersReserveContribution.value +
      fees.value
    );
  } else {
    return (
      additionalAmount.value - borrowersReserveContribution.value - fees.value
    );
  }
});

const collateralDifference = computed(() => {
  const difference = collateralInput.value - position.value.collateralBalance;
  return difference !== 0 ? difference.toFixed(2) : 0;
});

const collateralNote = computed(() => {
  if (!collateralDifference.value) return;

  if (collateralDifference.value < 0) {
    return `${Math.abs(collateralDifference.value)} ${
      position.value.collateral.symbol
    } sent back to your wallet`;
  } else {
    return `${collateralDifference.value} ${position.value.collateral?.symbol} taken from your wallet.`;
  }
});

const liquidationPriceNote = computed(() => {
  if (liquidationPriceInput.value > position.value.price)
    return 'If you increase the price, there is a cool down period of 3 days.';
  return null;
});

const reserveContributionLabel = computed(() =>
  isNegativeDifference.value ? 'Taken from reserve' : 'Reserve contribution'
);

const disabled = computed(
  () => !collateralInput.value || !liquidationPriceInput.value
);

const allow = async () => {
  pending.value = true;
  const amountToApprove = 20000000000000;

  await collateralApprove(
    position.value.collateral.address,
    position.value.address,
    amountToApprove
  );

  usersRepository.setAllowance(
    auth.wallet,
    position.value.address,
    amountToApprove
  );

  pending.value = false;
};

const submit = async () => {
  pending.value = true;

  const tx = await adjustPosition(
    address,
    mintedInput,
    collateralInput,
    liquidationPriceInput
  );

  pending.value = false;

  if (!tx.error) {
    await reload();

    router.push({
      name: 'positionDetail',
      params: { address: address },
    });
  }
};

const inputsInit = () => {
  if (position.value.minted !== null) {
    mintedInput.value = position.value.minted;
  }

  if (position.value.collateralBalance !== null) {
    collateralInput.value = position.value.collateralBalance;
  }

  if (position.value.price !== null) {
    liquidationPriceInput.value = position.value.price;
  }
};

const error = computed(() => {
  if (!position.value.isOwningPosition) {
    return {
      message: 'You can only adjust your own positions.',
    };
  } else if (mintedInput.value < 0) {
    return {
      message: 'You Cannot adjust a position with a negative amount.',
    };
  } else if (position.value.challengedAmount > 0) {
    return {
      message: 'You cannot adjust a challenged position.',
    };
  } else if (mintedInput.value > position.value.limit) {
    return {
      message: `This position is limited to ${position.value.limit} ZCHF`,
    };
  } else if (mintedInput.value > auth.user.ZCHF) {
    return {
      message: 'Insufficient ZCHF amount in wallet',
    };
  } else if (
    collateralDifference.value > position.value.collateral.userBalance
  ) {
    return {
      message: `Insufficient ${position.value.collateral.symbol} amount in wallet`,
    };
  } else if (
    mintedInput.value >
    collateralInput.value * liquidationPriceInput.value
  ) {
    return {
      message: 'Insufficient collateral for the given amount.',
    };
  } else if (
    mintedInput.value > position.value.minted &&
    liquidationPriceInput.value > position.value.price
  ) {
    return {
      message:
        'Cannot increase the amount and the price in the same transaction.',
    };
  }

  return null;
});

if (!loading.value) inputsInit();
else {
  watch(loading, () => {
    inputsInit();
  });
}

provide('position', position);
provide('disabled', disabled);
provide('needsAllowance', true);
provide('allowed', allowed);
provide('pending', pending);
provide('error', error);
provide('allow', allow);
provide('submit', submit);
</script>
