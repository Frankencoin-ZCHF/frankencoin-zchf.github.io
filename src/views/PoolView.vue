<template>
  <AppPageHeader
    title="Buy Frankencoin Pool Shares (FPS) to earn rewards and voting power."
  />

  <section class="container mx-auto">
    <div class="flex flex-col gap-2" v-if="!loading">
      <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
        <AppBox>
          <DisplayLabel label="Supply">
            <DisplayAmount
              :amount="equity.totalSupply"
              currency="FPS"
              :currencyAddress="addresses.equity"
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Price">
            <DisplayAmount
              :amount="equity.price"
              currency="ZCHF"
              :currencyAddress="addresses.equity"
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Market Cap">
            <DisplayAmount
              :amount="equity.marketCap"
              label="Market Cap"
              currency="ZCHF"
              :currencyAddress="addresses.frankencoin"
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Total Reserve">
            <DisplayAmount
              :amount="frankencoin.totalReserve"
              currency="ZCHF"
              :currencyAddress="addresses.frankencoin"
          /></DisplayLabel>
        </AppBox>
      </div>

      <div class="m-2">
        Contract
        <a class="text-link text-red" target="_blank" :href="frankencoin.url">
          {{ frankencoin.shortenAddress }}
        </a>
      </div>

      <div class="grid grid-cols-1 gap-1 lg:grid-cols-2">
        <AppBox>
          <div class="m-auto max-w-lg pb-8">
            <h6 class="mb-8 text-center">Buy or redeem FPS</h6>
            <SwapBoxFps></SwapBoxFps>
          </div>
        </AppBox>

        <div class="flex flex-col gap-1">
          <AppBox>
            <DisplayLabel label="Your shares">
              <DisplayAmount
                :amount="auth.user.FPS"
                currency="FPS"
                :currencyAddress="addresses.equity"
            /></DisplayLabel>
          </AppBox>

          <AppBox>
            <DisplayLabel label="Your shares value">
              <DisplayAmount
                :amount="auth.user.FPSValue"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
              />
            </DisplayLabel>
          </AppBox>

          <AppBox class="flex-1">
            <DisplayLabel label="Voting Power">
              <DisplayAmount :amount="auth.user.votingPower" currency="%" />
            </DisplayLabel>
            <p>
              A minimum of 3% of the total supply is required to obtain veto
              power.
            </p>
          </AppBox>
        </div>
      </div>
    </div>
    <AppBox v-else>
      <AppLoading />
    </AppBox>
  </section>
</template>

<script setup>
import { inject } from 'vue';
import { addresses } from '@/contracts/dictionnary';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import DisplayLabel from '@/components/DisplayLabel.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import SwapBoxFps from '@/components/SwapBoxFps.vue';

const frankencoin = inject('frankencoin');
const equity = inject('equity');
const auth = inject('auth');
const loading = inject('loading');
</script>
