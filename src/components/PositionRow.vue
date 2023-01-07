<template>
  <AppTableRow>
    <div
      class="grid flex-grow grid-cols-2 gap-3 sm:grid-cols-1"
      :class="`md:grid-cols-${columns.length}`"
    >
      <div>
        <AppTableHeaderMobile :text="columns[0]" />

        <DisplayAmount
          :amount="position.collateralBalance"
          :currency="position.collateral.symbol"
          :currencyAddress="position.collateral.address"
          inline
        />
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[1]" />

        <DisplayAmount
          :inline="true"
          :amount="position.scaledPrice"
          :currencyAddress="addresses.frankencoin"
          currency="ZCHF"
        />
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[2]" />

        <DisplayAmount
          :inline="true"
          :amount="position.available"
          :currencyAddress="addresses.frankencoin"
          currency="ZCHF"
        />
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[3]" />
        <b>{{ position.expiration.formatted }}</b>
      </div>
    </div>

    <div class="flex-shrink-0 md:w-40">
      <AppButton
        :to="'/position/detail/' + position.address"
        primary
        full
        size="small"
        >Details</AppButton
      >
    </div>
  </AppTableRow>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import AppTableHeaderMobile from '@/components/AppTableHeaderMobile.vue';
import AppTableRow from '@/components/AppTableRow.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import { addresses } from '@/contracts/dictionnary';

defineProps({
  position: Object,
  columns: Array,
});
</script>
