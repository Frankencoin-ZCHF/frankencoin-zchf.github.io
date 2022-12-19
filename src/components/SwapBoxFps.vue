<template>
  <AppForm>
    <SwapFieldInput
      v-model.number="amount"
      :max="from.max"
      :fromWallet="true"
      :symbol="from.symbol"
      :error="error"
      :limit="limit"
      :limitLabel="limitLabel"
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
      label="Receive"
      :max="to.max"
      :fromWallet="true"
      :symbol="to.symbol"
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
import { computed, ref, watch, inject, provide } from 'vue';
import blockchain from '@/config';

import useSwapBox from '@/composables/useSwapBox';

import useCalculate from '@/composables/useCalculate';

import AppForm from '@/components/AppForm.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import SwapFieldOutput from '@/components/SwapFieldOutput.vue';
import AppButton from '@/components/AppButton.vue';

import zchfToFps from '@/transactions/zchfToFps';
import fpsToZchf from '@/transactions/fpsToZchf';

import calculateFpsFromZchf from '@/transactions/calculateFpsFromZchf';
import calculateZchfFromFps from '@/transactions/calculateZchfFromFps';

import { formatCurrency } from '@/utils/formatNumber';

const equity = inject('equity');
const auth = inject('auth');
const reload = inject('reload');

const amount = ref(0);
const result = ref(0);

const pending = ref(false);
const conversionNote = ref(null);

const loading = computed(() => false);
const disabled = computed(() => !amount.value);

const wrongChain = computed(() => auth.chainId != blockchain.targetChainId);

const currencyA = ref({
  symbol: 'ZCHF',
  placeholder: 'ZCHF amount',
  label: 'Send',
  max: computed(() => auth.user.ZCHF),

  calculate: () => calculateFpsFromZchf(amount),
  transaction: async () => {
    pending.value = true;

    const tx = await zchfToFps(amount, reload);

    pending.value = false;

    if (!tx.error) amount.value = 0;
  },
});

const currencyB = ref({
  symbol: 'FPS',
  placeholder: 'FPS amount',
  label: 'Send',
  max: computed(() => auth.user.FPS),

  calculate: () => calculateZchfFromFps(amount),
  transaction: async () => {
    pending.value = true;

    const tx = await fpsToZchf(amount, reload);

    pending.value = false;

    if (!tx.error) amount.value = 0;
  },
});

const { from, to, isReversed, switchDirection } = useSwapBox({
  currencyA,
  currencyB,
  amount,
  result,
});

const error = computed(() => {
  if (amount.value < 0) {
    return {
      message: 'Cannot swap a negative amount.',
      blockCalculation: true,
    };
  } else if (isReversed.value && amount.value > equity.value.totalSupply - 1) {
    return {
      message: 'Reserve capacity exceeded.',
      blockCalculation: true,
    };
  } else if (amount.value > from.value.max) {
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
  if (result.value && amount.value && !error.value?.blockCalculation) {
    let ratio = 0;

    if (isReversed.value) {
      ratio = result.value / amount.value;
    } else {
      ratio = amount.value / result.value;
    }

    conversionNote.value = `1 ${currencyB.value.symbol} = ${formatCurrency(
      ratio
    )} ${currencyA.value.symbol}`;
  } else {
    conversionNote.value = 'FPS price is dynamically calculated';
  }
};

watch([loading, isCalculating, amount, isReversed], () => {
  if (!loading.value && !wrongChain.value) calculate();
  if (!isCalculating.value) updateConversionNote();
});

updateConversionNote();

const limit = computed(() =>
  isReversed.value ? equity.value.totalSupply - 1 : null
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
