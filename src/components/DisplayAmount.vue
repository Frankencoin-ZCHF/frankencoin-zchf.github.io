<template>
  <span>
    <template v-if="!amount">-</template>
    <template v-else>
      <span :class="{ 'font-bold': bold, 'text-3xl': big }">
        {{
          noRounding ? formatCommify(amount) : formatCurrency(amount, digits)
        }}
      </span>

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
import AppButton from '@/components/AppButton.vue';
import { contractUrl } from '@/utils/address.js';
import { formatCommify, formatCurrency } from '@/utils/formatNumber';

defineProps({
  amount: [String, Number],
  currency: String,
  currencyAddress: String,
  digits: {
    type: Number,
    default: 2,
  },
  bold: {
    type: Boolean,
    default: true,
  },
  noRounding: {
    type: Boolean,
    default: false,
  },
  big: Boolean,
});
</script>
