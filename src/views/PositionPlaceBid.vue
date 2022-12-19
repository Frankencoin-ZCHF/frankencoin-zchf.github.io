<template>
  <AppPageHeader
    title="Place your bid"
    backText="Back to position"
    :backTo="'/position/detail/' + address"
  />

  <section class="mx-auto flex max-w-2xl flex-col gap-y-4 px-4 sm:px-8">
    <AppBox>
      <AppForm v-if="!loading">
        <div class="space-y-12">
          <div class="space-y-4">
            <SwapFieldInput
              v-model.number="amount"
              label="Your bid"
              :max="maxAmount"
              :customMaxAmount="auth.user.ZCHF"
              :showWallet="true"
              symbol="ZCHF"
            />
            <div class="flex flex-col gap-1">
              <span
                >1 {{ position.collateral.symbol }} = {{ bidRatio }} ZCHF</span
              >
              <span class="text-sm">
                If there is a higher bid your ZCHF go back to your wallet.
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2" v-if="challenge">
            <div class="flex">
              <div class="flex-1">
                <span class="font-bold">Auctionned Collateral</span>
              </div>
              <div>
                {{ formatCurrency(challenge.size) }}
                <AppButton
                  tag="a"
                  :link="true"
                  target="_blank"
                  :href="contractUrl(position.collateral.address)"
                >
                  {{ position.collateral.symbol }}
                </AppButton>
              </div>
            </div>

            <div class="flex">
              <div class="flex-1">Buy now price</div>
              <div>
                {{ formatCurrency(buyNowPrice) }}
                <AppButton
                  tag="a"
                  :link="true"
                  target="_blank"
                  :href="contractUrl(frankencoin.address)"
                >
                  zCHF
                </AppButton>
              </div>
            </div>

            <div class="flex">
              <div class="flex-1">Highest bid</div>
              <div>
                {{ formatCurrency(challenge.bid) }}
                <AppButton
                  tag="a"
                  :link="true"
                  target="_blank"
                  :href="contractUrl(frankencoin.address)"
                >
                  zCHF
                </AppButton>
              </div>
            </div>

            <div class="flex" v-if="challenge.bid > 0">
              <div class="flex-1">Current bidder</div>
              <AppButton
                tag="a"
                :link="true"
                target="_blank"
                :href="contractUrl(challenge.bidderAddress)"
              >
                {{ shortenAddress(challenge.bidderAddress) }}
              </AppButton>
            </div>

            <div class="flex">
              <div class="flex-1">Time remaining</div>
              <ChallengeExpiration
                :isExpired="challenge.end.isExpired"
                :remaining="challenge.end.remaining"
              />
            </div>

            <div class="flex">
              <div class="flex-1">Auction duration</div>
              <div>{{ duration }}</div>
            </div>

            <div class="flex">
              <div class="flex-1">Challenger</div>
              <AppButton
                tag="a"
                :link="true"
                target="_blank"
                :href="contractUrl(challenge.challengerAddress)"
              >
                {{ shortenAddress(challenge.challengerAddress) }}
              </AppButton>
            </div>
          </div>
        </div>
      </AppForm>
      <AppLoading v-else />
    </AppBox>
  </section>
</template>

<script setup>
import { ref, computed, provide, inject } from 'vue';
import { useRoute } from 'vue-router';

import { addresses } from '@/contracts/dictionnary';

import { contractUrl, shortenAddress } from '@/utils/address';
import { formatCurrency } from '@/utils/formatNumber';
import { durationFormatter } from '@/utils/date';

import allowZchf from '@/transactions/allowZchf';
import placeBid from '@/transactions/placeBid';

import useChallengesRepository from '@/repositories/useChallengesRepository';
import useUsersRepository from '@/repositories/useUsersRepository';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppBox from '@/components/AppBox.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppForm from '@/components/AppForm.vue';
import AppButton from '@/components/AppButton.vue';
import SwapFieldInput from '@/components/SwapFieldInput.vue';
import ChallengeExpiration from '@/components/ChallengeExpiration.vue';

const auth = inject('auth');
const reload = inject('reload');
const loading = inject('loading');
const frankencoin = inject('frankencoin');

const route = useRoute();
const address = route.params.address;
const index = parseInt(route.params.challenge);

const challengesRepository = useChallengesRepository();
const UsersRepository = useUsersRepository();

const challenge = computed(() => challengesRepository.getByIndex(index));
const position = computed(() => challenge.value.position);

const disabled = computed(() => !amount.value);

const allowed = computed(() => {
  const allowedAmount = auth.user.ZCHFMintingHubAllowance;

  return amount.value ? allowedAmount >= amount.value : allowedAmount > 0;
});

const amount = ref();

const pending = ref(false);

const buyNowPrice = computed(() => {
  if (!challenge.value.size) {
    return 0;
  } else {
    return position.value.price * challenge.value.size;
  }
});

const maxAmount = computed(() => Math.min(auth.user.ZCHF, buyNowPrice.value));

const bidRatio = computed(
  () => formatCurrency(amount.value / challenge.value.size) || 0
);

const duration = computed(() =>
  durationFormatter(position.value.challengePeriod)
);

const error = computed(() => {
  if (amount.value < 0) {
    return {
      message: 'Cannot place a bid with a negative amount.',
    };
  } else if (amount.value > buyNowPrice.value) {
    return {
      message: 'Cannot be higher than buy now price',
    };
  } else if (!challenge.value) {
    return {
      message: 'Cannot bid on non existing challenge',
    };
  } else if (amount.value > auth.user.ZCHF) {
    return {
      message: 'Insufficient ZCHF amount in wallet',
    };
  }

  return null;
});

const allow = async () => {
  pending.value = true;
  const amountToApprove = 20000000000000;

  await allowZchf(addresses.mintingHub, amountToApprove);

  pending.value = false;

  UsersRepository.where('address', auth.user.address).update({
    ZCHFMintingHubAllowance: amountToApprove,
  });
};

const submit = async () => {
  pending.value = true;
  const tx = await placeBid(
    challenge.value.index,
    amount,
    challenge.value.size
  );

  if (!tx.error) {
    amount.value = null;

    await reload();
  }

  pending.value = false;
};

provide('disabled', disabled);
provide('needsAllowance', true);
provide('allowed', allowed);
provide('pending', pending);
provide('error', error);
provide('allow', allow);
provide('submit', submit);
</script>
