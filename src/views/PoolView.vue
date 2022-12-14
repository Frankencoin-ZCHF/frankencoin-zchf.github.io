<template>
  <AppPageHeader title="Frankencoin Pool Shares (FPS)" />

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
        <a class="text-link text-red" target="_blank" :href="equity.url">
          {{ equity.shortenAddress }}
        </a>
      </div>

      <div class="grid grid-cols-1 gap-1 lg:grid-cols-2">
        <AppBox>
          <div class="m-auto max-w-lg pb-8">
            <h6 class="mb-8 text-center">Buy or redeem</h6>
            <SwapBoxFps></SwapBoxFps>
          </div>
        </AppBox>

        <div class="flex flex-col gap-1">
          <AppBox>
            <DisplayLabel label="Your shares">
              <DisplayAmount
                :amount="auth.user.FPS"
                :digits="5"
                currency="FPS"
                :currencyAddress="addresses.equity"
            /></DisplayLabel>
          </AppBox>

          <AppBox>
            <DisplayLabel label="Your shares value">
              <DisplayAmount
                :amount="
                  auth.isConnected && !wrongChain ? auth.user.FPSValue : 0
                "
                :digits="5"
                currency="ZCHF"
                :currencyAddress="addresses.frankencoin"
              />
            </DisplayLabel>
          </AppBox>

          <AppBox class="flex-1">
            <DisplayLabel label="Voting Power">
              <DisplayAmount
                :amount="
                  auth.isConnected && !wrongChain ? auth.user.votingPower : 0
                "
                :digits="5"
                currency="%"
              />
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
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppPageHeader from '@/components/AppPageHeader.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import DisplayLabel from '@/components/DisplayLabel.vue';
import SwapBoxFps from '@/components/SwapBoxFps.vue';
import blockchain from '@/config';
import { addresses } from '@/contracts/dictionnary';
import { computed, inject } from 'vue';

const frankencoin = inject('frankencoin');
const equity = inject('equity');
const auth = inject('auth');
const loading = inject('loading');

const wrongChain = computed(() => auth.chainId != blockchain.targetChainId);
</script>
