<template>
  <SwapField
    :label="label"
    :symbol="symbol"
    :max="max"
    :fromWallet="fromWallet"
    :clickableMax="true"
    @setMax="setMax"
    :hideMaxLabel="hideMaxLabel"
  >
    <div class="flex gap-1 rounded-lg bg-neutral-100 p-1">
      <input
        v-model="propModel"
        type="number"
        inputmode="decimal"
        pattern="[0-9]"
        class="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
        :class="{
          'text-red': !!error,
        }"
        step="any"
        :max="maxInput && max"
        min="0"
        :placeholder="placeholder"
        ref="focusInput"
        @keyup="keyUpHandle($event)"
        @keydown="keyDownHandle($event)"
      />

      <AppButton field @click="setMax" v-if="displayMaxButton">Max</AppButton>

      <slot name="action"></slot>
    </div>

    <template #note v-if="showLimit">
      <span>
        {{ limitLabel }}:
        <DisplayAmount :amount="limit" :currency="symbol" inline noRounding />
      </span>
    </template>
  </SwapField>
</template>

<script setup>
import { computed } from 'vue';
import SwapField from '@/components/SwapField.vue';
import AppButton from '@/components/AppButton.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';

import { bigNumberMin } from '@/utils/math';
import { shrinkDecimals } from '@/utils/formatNumber';

const emit = defineEmits(['update:modelValue']);

const keyDownHandle = (event) => {
  const key = event.key;
  const charCode = event.keyCode;
  const prohibitedCharcodes = [189, 69, 190];
  const inputValue = event.target.value;
  const index = inputValue.indexOf('.');
  const decimals = inputValue.substring(index + 1);
  const decimalsLength = decimals.length + 1;

  if (
    prohibitedCharcodes.includes(charCode) ||
    (decimalsLength > 18 && !isNaN(key))
  ) {
    event.preventDefault();
  }
};

const keyUpHandle = (event) => {
  emit('update:modelValue', event.target.value);
};

const props = defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
    default: 'Send',
  },
  symbol: String,
  placeholder: {
    type: String,
    default: 'Input amount',
  },
  max: [Number, String],
  limit: String,
  limitLabel: String,
  customMaxAmount: [String, Number],
  maxInput: {
    type: Boolean,
    default: true,
  },
  fromWallet: {
    type: Boolean,
    default: true,
  },
  displayMaxButton: {
    type: Boolean,
    default: false,
  },
  hideMaxLabel: {
    type: Boolean,
    default: false,
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
      ? bigNumberMin(props.max, props.limit)
      : props.max;

  const shrinked = shrinkDecimals(max);

  emit('update:modelValue', shrinked);
};
</script>
