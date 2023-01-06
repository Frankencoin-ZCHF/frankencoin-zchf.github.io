<template>
  <AppPageHeader title="My auctions" />
  <AppTable :columns="columns">
    <template v-if="auth.isConnected && !loading && myChallenges.length > 0">
      <template v-if="myChallenges.length > 0">
        <ChallengeRow
          v-for="challenge in myChallenges"
          :columns="columns"
          :challenge="challenge"
          :key="challenge.address"
        />
      </template>
    </template>

    <AppTableRow class="col-span-2 md:col-span-1" v-else>
      <template v-if="!loading">{{ myChallengeFallback }}</template>
      <AppLoading v-else />
    </AppTableRow>
  </AppTable>

  <AppPageHeader title="All auctions" class="mt-8" />
  <AppTable :columns="columns">
    <template v-if="allChallenges.length > 0 && !loading">
      <ChallengeRow
        v-for="challenge in allChallenges"
        :columns="columns"
        :challenge="challenge"
        :key="challenge.address"
      />
    </template>
    <AppTableRow class="col-span-2 md:col-span-1" v-else>
      <template v-if="!loading">There are no auctions yet.</template>
      <AppLoading v-else />
    </AppTableRow>
  </AppTable>
</template>

<script setup>
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import AppTable from '@/components/AppTable.vue';
import AppTableRow from '@/components/AppTableRow.vue';
import ChallengeRow from '@/components/ChallengeRow.vue';
import useChallengesRepository from '@/repositories/useChallengesRepository';
import { computed, inject } from 'vue';

const auth = inject('auth');
const loading = inject('loading');

const challengesRepository = useChallengesRepository();

const myChallenges = computed(() => challengesRepository.getMyChallenges());
const allChallenges = computed(() => challengesRepository.getAllChallenges());

const myChallengeFallback = computed(() =>
  auth.isConnected
    ? "You don't have any auction."
    : 'You need to be connected to see your auctions.'
);

const columns = [
  'Auctionated Collateral',
  'Highest Bid',
  'Buy now Price',
  'Owner',
  'State',
];
</script>
