<template>
  <AppPageHeader title="My positions" />
  <AppTable :columns="columns">
    <template v-if="auth.isConnected && !loading && myPositions.length > 0">
      <template v-for="position in myPositions" :key="position.address">
        <PositionRow
          :columns="columns"
          :position="position"
          v-if="position.collateral"
        />
      </template>
    </template>
    <AppTableRow class="col-span-2 md:col-span-1" v-else>
      <template v-if="!loading">{{ myPositionsFallback }}</template>
      <AppLoading v-else />
    </AppTableRow>
  </AppTable>

  <AppPageHeader title="Other positions" class="mt-8" />
  <AppTable :columns="columns">
    <template v-if="allPositions.length > 0 && !loading">
      <template v-for="position in allPositions" :key="position.address">
        <PositionRow
          :columns="columns"
          :position="position"
          v-if="position.collateral"
        />
      </template>
    </template>
    <AppTableRow class="col-span-2 md:col-span-1" v-else>
      <template v-if="!loading">There are no positions yet.</template>
      <AppLoading v-else />
    </AppTableRow>
  </AppTable>
</template>

<script setup>
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import AppTable from '@/components/AppTable.vue';
import AppTableRow from '@/components/AppTableRow.vue';
import PositionRow from '@/components/PositionRow.vue';
import usePositionsRepository from '@/repositories/usePositionsRepository';
import { computed, inject } from 'vue';

const positionsRepository = usePositionsRepository();

const myPositions = computed(() => positionsRepository.getMyPositions());
const allPositions = computed(() => positionsRepository.getAllPositions());

const myPositionsFallback = computed(() =>
  auth.isConnected
    ? "You don't have position."
    : 'You need to be connected to see your positions.'
);

const auth = inject('auth');
const loading = inject('loading');

const columns = [
  'Collateral',
  'Liquidation Price',
  'Available Amount',
  'Expiration Date',
];
</script>
