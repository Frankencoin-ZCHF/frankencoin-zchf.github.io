<template>
  <AppTableRow>
    <div
      class="grid flex-grow grid-cols-2 gap-3 sm:grid-cols-1"
      :class="`md:grid-cols-${columns.length}`"
    >
      <div>
        <AppTableHeaderMobile :text="columns[0]" />
        <DisplayAmount
          :inline="true"
          :amount="challenge.size"
          :currency="challenge.position.collateral.symbol"
          :currencyAddress="challenge.position.collateral.address"
        />
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[1]" />
        <div class="flex flex-col gap-1">
          <DisplayAmount
            :inline="true"
            :amount="challenge.bid"
            :currency="frankencoin.symbol"
            :currencyAddress="frankencoin.address"
          />
          <div class="text-sm" v-if="bigNumberCompare('>', challenge.ratio, 0)">
            <DisplayAmount
              :inline="true"
              :amount="1"
              :currency="challenge.position.collateral.symbol"
              :bold="false"
            />
            =
            <DisplayAmount
              :inline="true"
              :amount="challenge.ratio"
              :currency="frankencoin.symbol"
              :bold="false"
            />
          </div>
        </div>
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[2]" />
        <DisplayAmount
          :inline="true"
          :amount="challenge.buyNowPrice"
          currency="ZCHF"
          :currencyAddress="'addresses.frankencoin'"
        />
      </div>

      <div>
        <AppTableHeaderMobile :text="columns[3]" />
        <AppButton
          tag="a"
          :link="true"
          :href="challenge.challenger.url"
          target="_blank"
          class="text-link"
        >
          {{ challenge.challenger.shortenAddress }}
        </AppButton>
      </div>

      <div class="col-span-2 pt-2 md:col-auto md:pt-0">
        <ChallengeState
          :isExpired="challenge.end.isExpired"
          :date="challenge.end.formatted"
        />
      </div>
    </div>

    <div class="flex-shrink-0 space-y-2 md:w-40">
      <AppButton
        v-if="challenge.end.isExpired"
        primary
        full
        size="small"
        :loading="pending"
        :disabled="
          !auth.isConnected || auth.chainId != blockchain.targetChainId
        "
        @click="closeChallenge(challenge.index)"
      >
        Close
      </AppButton>

      <AppButton
        v-else
        primary
        full
        size="small"
        :to="bidUrl"
        :loading="pending"
      >
        Bid
      </AppButton>
    </div>
  </AppTableRow>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import AppTableHeaderMobile from '@/components/AppTableHeaderMobile.vue';
import AppTableRow from '@/components/AppTableRow.vue';
import ChallengeState from '@/components/ChallengeState.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';
import blockchain from '@/config';
import endChallenge from '@/transactions/endChallenge';
import { bigNumberCompare } from '@/utils/math';
import { computed, inject, ref } from 'vue';

const auth = inject('auth');
const reload = inject('reload');
const frankencoin = inject('frankencoin');

const pending = ref(false);

const props = defineProps({
  challenge: Object,
  columns: Array,
});

const bidUrl = computed(
  () =>
    `/position/bid/${props.challenge.position.address}/${props.challenge.index}`
);

const closeChallenge = async (index) => {
  pending.value = true;

  const tx = await endChallenge(index);

  if (!tx.error) {
    await reload();
  }

  pending.value = false;
};
</script>
