<template>
  <AppPageHeader
    title="Adjust Your Position"
    backText="Back to position"
    :backTo="'/position/detail/' + address"
  />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm v-if="!loading && position">
        <div class="space-y-12">
          <div class="space-y-4">
            <SwapFieldInput
              v-model="mintedInput"
              label="Amount"
              :max="repayPosition"
              :fromWallet="false"
              :symbol="frankencoin.symbol"
              :decimals="frankencoin.decimals"
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
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                />
              </div>

              <div class="flex">
                <div class="flex-1">{{ paidOutToWalletLabel }}:</div>
                <DisplayAmount
                  :bold="false"
                  :amount="mintedInput ? paidOutToWalletAmount : null"
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                />
              </div>

              <div class="flex">
                <div class="flex-1">{{ reserveContributionLabel }}:</div>
                <DisplayAmount
                  :bold="false"
                  :amount="mintedInput ? borrowersReserveContribution : null"
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                />
              </div>

              <div class="flex font-bold" v-if="!isNegativeDifference">
                <div class="flex-1">Fee</div>
                <DisplayAmount
                  :bold="false"
                  :amount="mintedInput ? fees : null"
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                />
              </div>

              <hr />

              <div class="flex font-bold">
                <div class="flex-1">New amount</div>
                <DisplayAmount
                  :bold="false"
                  :amount="mintedInput"
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                />
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <SwapFieldInput
              v-model="collateralInput"
              label="Collateral"
              :max="auth.user.tokens[position.collateralAddress]?.amount"
              :showWallet="true"
              :symbol="position.collateral.symbol"
              :note="collateralNote"
              :decimals="position.collateral.decimals"
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
              v-model="liquidationPriceInput"
              label="Liquidation price"
              :max="position.price"
              :maxInput="false"
              :fromWallet="false"
              :hideMaxLabel="true"
              :symbol="frankencoin.symbol"
              :note="liquidationPriceNote"
              :decimals="frankencoin.decimals"
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
import AppBox from '@/components/AppBox.vue';
import AppForm from '@/components/AppForm.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import IconMagic from '@/components/icons/IconMagic.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import usePositionsRepository from '@/repositories/usePositionsRepository';
import useUsersRepository from '@/repositories/useUsersRepository';
import adjustPosition from '@/transactions/adjustPosition';
import collateralApprove from '@/transactions/collateralApprove';
import { formatCommify, formatDecimals } from '@/utils/formatNumber';
import { BigNumber } from 'ethers';
import {
  bigNumberAbs,
  bigNumberCompare,
  bigNumberMax,
  bigNumberOperate,
  fixedNumberOperate,
} from '@/utils/math';
import { computed, inject, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const auth = inject('auth');
const loading = inject('loading');
const reload = inject('reload');
const frankencoin = inject('frankencoin');

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

const repayPosition = computed(() => {
  return bigNumberMax(0, bigNumberOperate('-', position.value.minted, auth.user.ZCHF));
});

const allowed = computed(() =>
  bigNumberCompare('>=', auth.user.allowances[address], collateralInput.value)
);

const autoFill = (origin) => {
  switch (origin) {
    case 'minted':
      mintedInput.value = fixedNumberOperate(
        '*',
        collateralInput.value,
        liquidationPriceInput.value
      );
      break;
    case 'collateral':
      collateralInput.value = bigNumberMax(
        fixedNumberOperate('/', mintedInput.value, liquidationPriceInput.value),
        position.value.minimumCollateral
      );
      break;
    case 'liquidation':
      liquidationPriceInput.value = bigNumberCompare(
        '=',
        collateralInput.value,
        0
      )
        ? '0'
        : fixedNumberOperate('/', mintedInput.value, collateralInput.value);
      break;
  }
};

const additionalAmount = computed(() => {
  const floatMintedInput = parseFloat(mintedInput.value);

  if (!isNaN(floatMintedInput)) {
    return bigNumberOperate('-', mintedInput.value, position.value.minted);
  } else {
    return '0';
  }
});

const fees = computed(() =>
  bigNumberOperate(
    '/',
    bigNumberOperate(
      '*',
      additionalAmount.value,
      position.value.mintingFeePPM / 10
    ),
    100000
  )
);

const borrowersReserveContribution = computed(() => {
  const reserveTimesAdditionalAmount = bigNumberOperate(
    '*',
    position.value.reserveContribution,
    additionalAmount.value
  );

  return bigNumberAbs(
    bigNumberOperate('/', reserveTimesAdditionalAmount, 1000000)
  );
});

const isNegativeDifference = computed(() => {
  return bigNumberCompare('<', additionalAmount.value, 0);
});

const paidOutToWalletLabel = computed(() =>
  isNegativeDifference.value ? 'Taken in wallet' : 'Received in wallet'
);

const paidOutToWalletAmount = computed(() => {
  let amount;

  const reserveAndFees = fixedNumberOperate(
    '+',
    borrowersReserveContribution.value,
    fees.value
  );

  if (isNegativeDifference.value) {
    const additionalAndFees = fixedNumberOperate(
      '-',
      additionalAmount.value,
      fees.value
    );

    amount = bigNumberOperate(
      '-',
      bigNumberAbs(additionalAndFees),
      reserveAndFees
    );
  } else {
    amount = bigNumberOperate('-', additionalAmount.value, reserveAndFees);
  }

  return formatDecimals(amount);
});

const collateralDifference = computed(() => {
  const difference = bigNumberOperate(
    '-',
    collateralInput.value,
    position.value.collateralBalance
  );

  return !bigNumberCompare('=', difference, 0) ? difference : 0;
});

const isCollateralDifferenceNegative = computed(() =>
  bigNumberCompare('<', collateralDifference.value, 0)
);

const collateralNote = computed(() => {
  if (!collateralDifference.value) return;

  if (isCollateralDifferenceNegative.value) {
    return `${bigNumberAbs(collateralDifference.value)} ${
      position.value.collateral.symbol
    } sent back to your wallet`;
  } else {
    return `${formatCommify(collateralDifference.value)} ${
      position.value.collateral?.symbol
    } taken from your wallet.`;
  }
});

const liquidationPriceNote = computed(() => {
  return bigNumberCompare(
    '>',
    liquidationPriceInput.value,
    position.value.scaledPrice
  )
    ? 'If you increase the price, there is a cool down period of 3 days.'
    : null;
});

const reserveContributionLabel = computed(() =>
  isNegativeDifference.value ? 'Taken from reserve' : 'Reserve contribution'
);

const disabled = computed(
  () =>
    !parseFloat(collateralInput.value) ||
    !parseFloat(liquidationPriceInput.value)
);

const allow = async () => {
  pending.value = true;
  const amountToApprove = '2000000';

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

  const collateralDecimals = position.value.collateral.decimals;

  const tx = await adjustPosition(
    address,
    mintedInput,
    collateralInput,
    collateralDecimals,
    liquidationPriceInput);

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
  if (position.value) {
    if (position.value.minted !== null) {
      mintedInput.value = formatDecimals(position.value.minted);
    }

    if (position.value.collateralBalance !== null) {
      collateralInput.value = formatDecimals(position.value.collateralBalance);
    }

    if (position.value.price !== null) {
      liquidationPriceInput.value = formatDecimals(position.value.scaledPrice);
    }
  }
};

const error = computed(() => {
  if (!position.value.isOwningPosition) {
    return {
      message: 'You can only adjust your own positions.',
    };
  } else if (bigNumberCompare('<', mintedInput.value, 0)) {
    return {
      message: 'You Cannot adjust a position with a negative amount.',
    };
  } else if (bigNumberCompare('>', position.value.challengedAmount, 0)) {
    return {
      message: 'You cannot adjust a challenged position.',
    };
  } else if (bigNumberCompare('>', mintedInput.value, position.value.limit)) {
    return {
      message: `This position is limited to ${position.value.limit} ZCHF`,
    };
  } else if (
    isNegativeDifference.value &&
    bigNumberCompare('>', paidOutToWalletAmount.value, auth.user.ZCHF)
  ) {
    return {
      message: 'Insufficient ZCHF amount in wallet',
    };
  } else if (
    !isCollateralDifferenceNegative.value &&
    bigNumberCompare(
      '>',
      collateralDifference.value,
      auth.user.tokens[position.value.collateralAddress]?.amount
    )
  ) {
    return {
      message: `Insufficient ${position.value.collateral.symbol} amount in wallet`,
    };
  } else if (
    bigNumberCompare(
      '>',
      mintedInput.value,
      fixedNumberOperate(
        '*',
        collateralInput.value,
        liquidationPriceInput.value
      )
    )
  ) {
    return {
      message: 'Insufficient collateral for the given amount.',
    };
  } else if (
    bigNumberCompare('>', mintedInput.value, position.value.minted) &&
    bigNumberCompare('>', liquidationPriceInput.value, position.value.scaledPrice)
  ) {
    return {
      message:
        'Cannot increase the amount and the price in the same transaction.',
    };
  }

  return null;
});

if (!loading.value) {
  inputsInit();
} else {
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
