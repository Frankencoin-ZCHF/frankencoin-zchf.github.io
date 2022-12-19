<template>
  <SwapField
    :clickableMax="false"
    :note="note"
    :fromWallet="fromWallet"
    :label="label"
  >
    <div
      class="px-3 py-2 font-bold transition-opacity"
      :class="{ 'opacity-50': isCalculating }"
    >
      {{ formatCurrency(result, false) }}
    </div>
  </SwapField>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatNumber';
import SwapField from '@/components/SwapField.vue';

defineProps({
  result: [Number, String],
  isCalculating: Boolean,
  note: String,
  label: {
    type: String,
    default: 'Receive',
  },
  fromWallet: {
    type: Boolean,
    default: true,
  },
});
</script>
