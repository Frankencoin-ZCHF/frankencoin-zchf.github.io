<template>
  <AppPageHeader
    :title="`Overview Position ${shortenAddress(address)}`"
    :link="contractUrl(address)"
    backText="Back to positions"
    backTo="/positions/"
  />

  <section>
    <div class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
      <AppBox>
        <div class="flex flex-col gap-12" v-if="!loading">
          <div
            class="grid grid-cols-1 gap-x-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <DisplayLabel label="Borrowed Total">
              <DisplayAmount
                :amount="position.minted"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
                size="small"
              />
            </DisplayLabel>

            <DisplayLabel label="Collateral">
              <DisplayAmount
                size="small"
                :amount="position.collateralBalance"
                label="Collateral"
                :currency="position.collateral.symbol"
                :currencyAddress="position.collateral.address"
              />
            </DisplayLabel>

            <DisplayLabel label="Liquidation Price">
              <DisplayAmount
                size="small"
                :amount="position.price"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
              />
            </DisplayLabel>

            <DisplayLabel label="Retained Reserve">
              <DisplayAmount
                size="small"
                :amount="position.retainedReserve"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
              />
            </DisplayLabel>

            <DisplayLabel label="Limit">
              <DisplayAmount
                size="small"
                :amount="position.limit"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
              />
            </DisplayLabel>

            <DisplayLabel label="Owner">
              <b>
                <AppButton
                  tag="a"
                  :link="true"
                  :href="position.owner.url"
                  target="_blank"
                  class="text-link"
                  >{{ position.owner.shortenAddress }}
                </AppButton>
              </b>
            </DisplayLabel>

            <DisplayLabel label="Expiration Date">
              <b>
                {{ position.expiration.formatted }}
              </b>
            </DisplayLabel>

            <DisplayLabel label="Reserve Requirement">
              <DisplayAmount
                size="small"
                :amount="position.reserveContribution / 10000"
                currency="%"
              />
            </DisplayLabel>

            <DisplayLabel label="Minting Fee">
              <DisplayAmount
                size="small"
                :amount="position.mintingFeePPM / 10000"
                currency="%"
              />
            </DisplayLabel>
          </div>

          <template v-if="position.isOwningPosition">
            <div class="mx-auto w-72 max-w-full flex-col">
              <AppButton
                :to="'/position/adjust/' + position.address"
                primary
                full
                >Adjust</AppButton
              >
            </div>
          </template>

          <template v-else>
            <div class="mx-auto w-72 max-w-full flex-col">
              <div class="flex flex-col gap-y-4">
                <AppButton
                  :to="'/position/open/' + position.address"
                  primary
                  full
                  >Borrow</AppButton
                >
                <AppButton
                  :to="'/position/challenge/' + position.address"
                  primary
                  full
                  >Challenge</AppButton
                >
              </div>
            </div>
          </template>
        </div>
        <AppLoading v-else />
      </AppBox>
    </div>

    <AppPageHeader title="Positions challenges" class="mt-8" />

    <AppTable :columns="columns">
      <template v-if="challenges.length > 0 && !loading">
        <ChallengeRow
          v-for="challenge in challenges"
          :columns="columns"
          :challenge="challenge"
          :key="challenge.address"
        />
      </template>
      <AppTableRow class="col-span-2 md:col-span-1" v-else>
        <template v-if="!loading"
          >This position has not yet been challenged.</template
        >
        <AppLoading v-else />
      </AppTableRow>
    </AppTable>
  </section>
</template>

<script setup>
import AppBox from '@/components/AppBox.vue';
import AppButton from '@/components/AppButton.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import AppTable from '@/components/AppTable.vue';
import AppTableRow from '@/components/AppTableRow.vue';
import ChallengeRow from '@/components/ChallengeRow.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import DisplayLabel from '@/components/DisplayLabel.vue';
import { addresses } from '@/contracts/dictionnary';
import useChallengesRepository from '@/repositories/useChallengesRepository';
import usePositionsRepository from '@/repositories/usePositionsRepository';
import { contractUrl, shortenAddress } from '@/utils/address';
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const address = route.params.address;

const loading = inject('loading');

const positionsRepository = usePositionsRepository();
const challengesRepository = useChallengesRepository();

const position = computed(() => positionsRepository.getOne(address));
const challenges = computed(() => challengesRepository.getByPosition(address));

const columns = [
  'Auctionated Collateral',
  'Highest Bid',
  'Buy now Price',
  'Owner',
  'State',
];
</script>
