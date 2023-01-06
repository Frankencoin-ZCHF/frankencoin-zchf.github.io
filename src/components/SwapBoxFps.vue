<template>
  <AppForm class="space-y-4">
    <SwapFieldInput
      v-model="amount"
      :max="from.max"
      :fromWallet="true"
      :symbol="from.symbol"
      :error="error"
      :limit="limit"
      :limitLabel="limitLabel"
      :decimals="from.decimals"
    />

    <div class="text-center">
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
      label="Receive"
      :max="to.max"
      :fromWallet="true"
      :symbol="to.symbol"
      class
    />

    <div
      class="mt-2 px-1 transition-opacity"
      :class="{ 'opacity-50': isCalculating }"
    >
      {{ conversionNote }}&nbsp;
    </div>
  </AppForm>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import AppForm from '@/components/AppForm.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import SwapFieldOutput from '@/components/SwapFieldOutput.vue';
import useCalculate from '@/composables/useCalculate';
import useSwapBox from '@/composables/useSwapBox';
import blockchain from '@/config';
import calculateFpsFromZchf from '@/transactions/calculateFpsFromZchf';
import calculateZchfFromFps from '@/transactions/calculateZchfFromFps';
import fpsToZchf from '@/transactions/fpsToZchf';
import zchfToFps from '@/transactions/zchfToFps';
import { bigNumberCompare, fixedNumberOperate } from '@/utils/math';
import { computed, inject, provide, ref, watch } from 'vue';

const equity = inject('equity');
const frankencoin = inject('frankencoin');
const auth = inject('auth');
const reload = inject('reload');

const amount = ref();
const result = ref();

const pending = ref(false);
const conversionNote = ref(null);

const loading = computed(() => false);
const disabled = computed(() => !parseFloat(amount.value));

const wrongChain = computed(() => auth.chainId != blockchain.targetChainId);

const currencyA = ref({
  symbol: frankencoin.value.symbol,
  placeholder: `${frankencoin.value.symbol} amount`,
  label: 'Send',
  decimals: frankencoin.value.decimals,
  max: computed(() => auth.user.ZCHF),

  calculate: () => calculateFpsFromZchf(amount),
  transaction: async () => {
    pending.value = true;

    const tx = await zchfToFps(amount);

    pending.value = false;

    if (!tx.error) {
      amount.value = '0';
      await reload();
    }
  },
});

const currencyB = ref({
  symbol: equity.value.symbol,
  placeholder: `${equity.value.symbol} amount`,
  label: 'Send',
  decimals: equity.value.decimals,
  max: computed(() => auth.user.FPS),

  calculate: () => calculateZchfFromFps(amount),
  transaction: async () => {
    pending.value = true;

    const tx = await fpsToZchf(amount);

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
  result,
});

const error = computed(() => {
  if (bigNumberCompare('<', amount.value, 0)) {
    return {
      message: 'Cannot swap a negative amount.',
      blockCalculation: true,
    };
  } else if (limitReached.value) {
    return {
      message: 'Reserve capacity exceeded.',
      blockCalculation: true,
    };
  } else if (bigNumberCompare('>', amount.value, from.value.max)) {
    return {
      message: `Not enough ${from.value.symbol} in your wallet.`,
    };
  }

  return null;
});

const blockCalculation = computed(() => {
  if (error.value && error.value.blockCalculation) return true;
  if (loading.value) return true;

  return null;
});

const { calculate, isCalculating } = useCalculate({
  amount,
  result,
  blockCalculation,
  calcul: computed(() => from.value.calculate),
});

const updateConversionNote = () => {
  if (
    !bigNumberCompare('=', result.value, 0) &&
    !bigNumberCompare('=', amount.value, 0) &&
    parseFloat(amount.value) &&
    parseFloat(result.value) &&
    !error.value?.blockCalculation
  ) {
    let ratio = '0';

    if (isReversed.value) {
      ratio = fixedNumberOperate('/', result.value, amount.value);
    } else {
      ratio = fixedNumberOperate('/', amount.value, result.value);
    }

    conversionNote.value = `1 ${currencyB.value.symbol} = ${ratio} ${currencyA.value.symbol}`;
  } else {
    conversionNote.value = `${currencyB.value.symbol} price is dynamically calculated`;
  }
};

watch([loading, isCalculating, amount, isReversed], () => {
  if (!loading.value && !wrongChain.value && !pending.value) calculate();
  if (!isCalculating.value) updateConversionNote();
});

updateConversionNote();

const limit = computed(() =>
  isReversed.value ? fixedNumberOperate('-', equity.value.totalSupply, 1) : null
);

const limitReached = computed(() =>
  isReversed.value ? bigNumberCompare('>', amount.value, limit.value) : false
);

const limitLabel = computed(() =>
  isReversed.value ? 'Max FPS available' : null
);

provide('disabled', disabled);
provide('needsAllowance', false);
provide('pending', pending);
provide('error', error);
provide(
  'submit',
  computed(() => from.value.transaction)
);
</script>
