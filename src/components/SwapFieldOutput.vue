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
      {{ output }}
    </div>
  </SwapField>
</template>

<script setup>
import SwapField from '@/components/SwapField.vue';
import { computed } from 'vue';

const props = defineProps({
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

const output = computed(() => (props.result ? props.result : '0'));
</script>
