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
        type="text"
        inputmode="decimal"
        class="w-full flex-1 rounded-lg bg-transparent px-2 py-1 text-lg"
        :class="{ 'text-red': !!error }"
        :placeholder="placeholder"
        v-model="numberModel"
        :mask="Number"
        radix="."
        :mapToRadix="[',']"
        :scale="18"
        @accept:masked="onAccept"
        @accept:unmasked="onAcceptUnmasked"
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
import { shrinkDecimals } from '@/utils/formatNumber';
import { bigNumberMin } from '@/utils/math';
import { computed } from 'vue';
import { IMaskComponent } from 'vue-imask';

const emit = defineEmits(['update:modelValue']);

const numberModel = '';

const onAccept = (value) => {
  console.log(value);
};

const onAcceptUnmasked = (unmaskedValue) => {
  console.log(unmaskedValue);
};

// const keyDownHandle = (event) => {
//   const key = event.key;
//   const keyCode = event.keyCode;

//   const allowedKeycodes = [8, 16, 37, 39, 190, 188];
//   const isAllowedKey = allowedKeycodes.includes(keyCode);
//   const isValidKey = /[0-9]|\./.test(key) || isAllowedKey;

//   const inputValue = event.target.value;
//   const pointPosition = inputValue.indexOf('.');

//   const decimals = inputValue.substring(pointPosition + 1);
//   const decimalsLength = decimals.length + 1;
//   const tooManyDecimals = decimalsLength > 18;

//   if (keyCode === 188 && pointPosition < 0) {
//     emit('update:modelValue', `${inputValue}.`);
//     event.preventDefault();
//   }

//   if (
//     !isValidKey ||
//     (tooManyDecimals && !isAllowedKey) ||
//     ((keyCode === 188 || keyCode === 190) && pointPosition > 0)
//   ) {
//     event.preventDefault();
//   }
// };

// const keyUpHandle = (event) => {
//   emit('update:modelValue', event.target.value);
// };

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
