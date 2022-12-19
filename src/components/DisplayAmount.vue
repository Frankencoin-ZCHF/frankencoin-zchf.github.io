<template>
  <span>
    <template v-if="!formattedValue">-</template>
    <template v-else>
      <span :class="{ 'font-bold': bold, 'text-3xl': big }">{{
        formattedValue
      }}</span>

      <template v-if="currency != '%'">&nbsp;</template>

      <AppButton
        tag="a"
        :link="true"
        :href="contractUrl(currencyAddress)"
        target="_blank"
        class="text-link"
        v-if="currencyAddress"
        >{{ currency }}</AppButton
      >

      <span v-else>
        {{ currency }}
      </span>
    </template>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '@/utils/formatNumber';
import { contractUrl } from '@/utils/address.js';
import AppButton from '@/components/AppButton.vue';

const props = defineProps({
  amount: [Number],
  currency: String,
  currencyAddress: String,
  digits: Number,
  bold: {
    type: Boolean,
    default: true,
  },
  big: Boolean,
});

const formattedValue = computed(() => {
  return formatCurrency(props.amount, props.digits);
});
</script>
