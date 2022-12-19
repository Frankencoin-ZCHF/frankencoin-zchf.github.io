<template>
  <SwapField
    :label="label"
    :symbol="symbol"
    :max="max"
    :fromWallet="fromWallet"
    :clickableMax="true"
    @setMax="setMax"
  >
    <div class="flex gap-1 rounded-lg bg-neutral-100 p-1">
      <input
        v-model.number="propModel"
        type="number"
        inputmode="decimal"
        class="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
        :class="{
          'text-red': !!error,
        }"
        step="any"
        :max="maxInput && max"
        min="0"
        :placeholder="placeholder"
        ref="focusInput"
        @keyup="emit('update:modelValue', $event.target.value)"
      />

      <slot name="action"></slot>
    </div>

    <template #note v-if="showLimit">
      <span
        >{{ limitLabel }}:
        <DisplayAmount :amount="limit" :currency="symbol" inline
      /></span>
    </template>
  </SwapField>
</template>

<script setup>
import { computed } from 'vue';
import SwapField from '@/components/SwapField.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: [Number, String],
  label: {
    type: String,
    default: 'Send',
  },
  symbol: String,
  placeholder: {
    type: String,
    default: 'Input amount',
  },
  max: Number,
  limit: Number,
  limitLabel: String,
  customMaxAmount: Number,
  maxInput: {
    type: Boolean,
    default: true,
  },
  fromWallet: {
    type: Boolean,
    default: true,
  },
  error: Object,
});

const propModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val);
  },
});

const showLimit = computed(() => props.limit !== null && props.limitLabel);

const setMax = () => {
  const max =
    props.limit !== null && props.limit !== undefined
      ? Math.min(props.max, props.limit)
      : props.max;
  emit('update:modelValue', max);
};
</script>
