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
              v-model="amount"
              label="Your bid"
              :max="maxAmount"
              :customMaxAmount="auth.user.ZCHF"
              :showWallet="true"
              symbol="ZCHF"
            />
            <div class="flex flex-col gap-1">
              <span>
                <DisplayAmount
                  :amount="1"
                  :currency="position.collateral.symbol"
                  :currencyAddress="position.collateral.address"
                  :bold="false"
                  :noRounding="true"
                  inline
                />
                =
                <DisplayAmount
                  :amount="bidRatio"
                  :currency="frankencoin.symbol"
                  :currencyAddress="frankencoin.address"
                  :bold="false"
                  :noRounding="true"
                  inline
                />
              </span>
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
              <div class="font-bold">
                <DisplayAmount
                  :amount="challenge.size"
                  :currency="position.collateral.symbol"
                  :currencyAddress="position.collateral.address"
                  :bold="false"
                  inline
                />
              </div>
            </div>

            <div class="flex">
              <div class="flex-1">Buy now price</div>
              <DisplayAmount
                :amount="buyNowPrice"
                :currency="frankencoin.symbol"
                :currencyAddress="frankencoin.address"
                :bold="false"
                inline
              />
            </div>

            <div class="flex">
              <div class="flex-1">Highest bid</div>
              <DisplayAmount
                :amount="challenge.bid"
                :currency="frankencoin.symbol"
                :currencyAddress="frankencoin.address"
                :bold="false"
                inline
              />
            </div>

            <div class="flex" v-if="bigNumberCompare('>', challenge.bid, 0)">
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
import DisplayAmount from '@/components/DisplayAmount.vue';

import {
  bigNumberCompare,
  fixedNumberOperate,
  bigNumberMin,
} from '@/utils/math';

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

const disabled = computed(() => !parseFloat(amount.value));

const allowed = computed(() => {
  const allowedAmount = auth.user.ZCHFMintingHubAllowance;

  return amount.value
    ? bigNumberCompare('>=', allowedAmount, amount.value)
    : bigNumberCompare('>', allowedAmount, 0);
});

const amount = ref();

const pending = ref(false);

const buyNowPrice = computed(() => {
  if (!parseFloat(challenge.value.size)) {
    return '0';
  } else {
    return fixedNumberOperate('*', position.value.price, challenge.value.size);
  }
});

const maxAmount = computed(() =>
  bigNumberMin(auth.user.ZCHF, buyNowPrice.value)
);

const bidRatio = computed(() =>
  disabled.value
    ? '0'
    : fixedNumberOperate('/', amount.value, challenge.value.size)
);

const duration = computed(() =>
  durationFormatter(position.value.challengePeriod)
);

const error = computed(() => {
  if (bigNumberCompare('<', amount.value, 0)) {
    return {
      message: 'Cannot place a bid with a negative amount.',
    };
  } else if (bigNumberCompare('>', amount.value, buyNowPrice.value)) {
    return {
      message: 'Cannot be higher than buy now price',
    };
  } else if (!challenge.value) {
    return {
      message: 'Cannot bid on non existing challenge',
    };
  } else if (bigNumberCompare('>', amount.value, auth.user.ZCHF)) {
    return {
      message: 'Insufficient ZCHF amount in wallet',
    };
  }

  return null;
});

const allow = async () => {
  pending.value = true;
  const amountToApprove = '2000000';

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
