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
      <IMaskComponent
        v-model="propModel"
        type="text"
        inputmode="decimal"
        class="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
        :class="{ 'text-red': !!error }"
        :placeholder="placeholder"
        :mask="Number"
        radix="."
        :mapToRadix="[',']"
        :scale="decimals"
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
import AppButton from '@/components/AppButton.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import SwapField from '@/components/SwapField.vue';
import { formatDecimals } from '@/utils/formatNumber';
import { bigNumberMin } from '@/utils/math';
import { computed } from 'vue';
import { IMaskComponent } from 'vue-imask';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: String,
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
  decimals: {
    type: Number,
    default: 18,
  },
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

  const formatted = formatDecimals(max);
  emit('update:modelValue', formatted);
};
</script>
