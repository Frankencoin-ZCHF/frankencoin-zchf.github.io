<template>
  <section class="mt-16 grid items-center gap-20 align-middle lg:grid-cols-5">
    <div class="lg:col-span-3">
      <h1 class="mb-12 text-right text-4xl font-bold">
        Welcome to the
        <img class="" src="@/assets/logo.svg" />
      </h1>

      <p class="text-lg font-bold">
        This website provides a frontend to the Frankencoin smart contracts that
        reside on Ethereum mainnet. Both the website and the smart contracts
        governing the Frankencoin are open source and can be freely copied for
        any purpose.
      </p>

      <p>
        The Frankencoin is a collateralized stablecoin that is intended to track
        the value of the Swiss Franc. It's governance is decentralized, with
        anyone being able to propose new minting mechanisms and anyone who
        contributed more than 3% to the stability reserve being able to veto new
        minting mechanisms. It should be seen as experimental and not be relied
        upon. The core ideas of the Frankencoin including a novel auction-based
        minting mechanism are described in the Frankencoin research paper.
        Unlike the minting mechanisms of other collateralized stablecoins,
        Frankencoin's auction-based mechanism does not depend on external
        oracles and is therefore also very versatile with regards to the used
        collateral, as long as its volatility with regards to the Swiss Franc is
        limited.
      </p>

      <p>
        The structure of the website follows the technical structure of the
        smart contracts.
      </p>
    </div>

    <div class="lg:col-span-2">
      <img class="m-auto w-full max-w-lg" src="@/assets/logoSquare.svg" />
    </div>
  </section>

  <div class="my-16 border-t border-b border-gray-200 bg-white py-5 uppercase">
    <h2 class="text-center text-2xl font-bold">
      Collateralized minting methods governed by a democratic process.
    </h2>
  </div>

  <section class="m-auto flex flex-col gap-2">
    <h2 class="text-2xl font-bold">Frankencoin Contract</h2>
    <p>
      Frankencoin is a freely transferrable token that follows the ERC-20
      standard. The name is inspired by its self-governing nature.
    </p>

    <div class="grid gap-1 lg:grid-cols-3">
      <div class="grid grid-cols-6 gap-1 lg:col-span-2">
        <AppBox class="col-span-6 sm:col-span-3">
          <DisplayLabel label="Supply">
            <DisplayAmount
              :amount="frankencoin.totalSupply"
              :currency="frankencoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox class="col-span-6 sm:col-span-3">
          <DisplayLabel label="Your ZCHF">
            <DisplayAmount
              :amount="auth.user.ZCHF"
              :currency="frankencoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox class="col-span-3 sm:col-span-2">
          <DisplayLabel label="Equity">
            <DisplayAmount
              :amount="frankencoin.equity"
              :currency="frankencoin.symbol"
            />
          </DisplayLabel>
        </AppBox>

        <AppBox class="col-span-3 sm:col-span-2">
          <DisplayLabel label="Swap pool">
            <DisplayAmount
              :amount="stablecoin.bridgeBalance"
              :currency="stablecoin.symbol"
            />
          </DisplayLabel>
        </AppBox>

        <AppBox class="col-span-6 sm:col-span-2">
          <DisplayLabel label="Minter reserve">
            <DisplayAmount
              :amount="frankencoin.minterReserve"
              :currency="frankencoin.symbol"
            />
          </DisplayLabel>
        </AppBox>
      </div>

      <div class="flex flex-col items-center justify-center py-8">
        <div class="flex flex-col gap-2">
          <h3 class="font-bold">Inspect contract</h3>
          <AppButton
            full
            tag="a"
            :href="frankencoin.url"
            target="_blank"
            secondary
          >
            {{ frankencoin.shortenAddress }}
          </AppButton>
          <AppButton
            full
            primary
            @click="openDialog('walletConnect')"
            v-if="!auth.isConnected"
          >
            Connect wallet
          </AppButton>
        </div>
      </div>
    </div>

    <hr class="my-12" />

    <h2 class="text-2xl font-bold">Reserve Pool</h2>
    <p>
      The reserve pool contains Frankencoins. Its purpose is to absorbs losses
      and accumulates income. Anyone can contribute ZCHF to the reserve pool,
      getting freely transferrable pool shares in return. Pool shares can be
      redeemed as long as the reserve target is met. Contributions and
      redemptions are always done in proportion to the reserve. For example, if
      the reserve contains 9900 ZCHF and you add 100 ZCHF, you will get 1% of
      all reserve tokens in return, and vice versa when redeeming Frankencoin
      Pool Shares (FPS).
    </p>

    <div class="grid gap-1 lg:grid-cols-3">
      <div class="grid gap-1 sm:grid-cols-2 lg:col-span-2">
        <AppBox>
          <DisplayLabel label="Price">
            <DisplayAmount
              :amount="equity.price"
              :currency="frankencoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Market cap">
            <DisplayAmount
              :amount="equity.marketCap"
              :currency="frankencoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Total Supply">
            <DisplayAmount
              :amount="equity.totalSupply"
              :currencyAddress="equity.address"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Your FPS">
            <DisplayAmount :amount="auth.user.FPS" big />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Total votes">
            <DisplayAmount :amount="equity.totalVotes" big />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Your votes">
            <DisplayAmount :amount="auth.user.votes" big />
          </DisplayLabel>
        </AppBox>
      </div>

      <div class="flex flex-col items-center justify-center py-8">
        <div class="flex flex-col gap-2">
          <h3 class="font-bold">Inspect contract</h3>
          <AppButton full tag="a" :href="equity.url" target="_blank" secondary>
            {{ equity.shortenAddress }}
          </AppButton>
          <AppButton
            full
            primary
            @click="openDialog('walletConnect')"
            v-if="!auth.isConnected"
          >
            Connect wallet
          </AppButton>
        </div>
      </div>
    </div>

    <hr class="my-12" />

    <h2 class="text-2xl font-bold">Stablecoin Bridges</h2>
    <p>
      Bridge contracts allow you to convert other Swiss Franc stablecoins 1:1
      into ZCHF. The deposited stablecoins are kept in the bridge contract until
      another user wants to convert ZCHF back into the resprective stablecoin.
    </p>

    <h3 class="text-xl font-bold">CryptoFranc (XCHF)</h3>

    <div class="grid gap-1 lg:grid-cols-3">
      <div class="grid gap-1 sm:grid-cols-2 lg:col-span-2">
        <AppBox>
          <DisplayLabel label="Bridge Balance">
            <DisplayAmount
              :amount="stablecoin.bridgeBalance"
              :currency="stablecoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>

        <AppBox>
          <DisplayLabel label="Your XCHF">
            <DisplayAmount
              :amount="auth.user.XCHF"
              :currency="stablecoin.symbol"
              big
            />
          </DisplayLabel>
        </AppBox>
      </div>

      <div class="flex flex-col items-center justify-center py-8">
        <div class="flex flex-col gap-2">
          <h3 class="font-bold">Inspect contract</h3>
          <AppButton
            full
            tag="a"
            :href="stablecoin.url"
            target="_blank"
            secondary
          >
            {{ stablecoin.shortenAddress }}
          </AppButton>
          <AppButton
            full
            primary
            @click="openDialog('walletConnect')"
            v-if="!auth.isConnected"
          >
            Connect wallet
          </AppButton>
        </div>
      </div>
    </div>

    <hr class="my-12" />

    <h2 class="text-2xl font-bold">Collateralized Positions</h2>
    <p>
      Collateralized minting positions allow their owner to mint ZCHF against a
      collateral. Anyone can open new collateral positions and start minting
      ZCHF once the initialization period has passed. Positions that are not
      sufficiently collateralized can be challenged by anyone through an auction
      mechanism. When challenging a position, the challenger must provide some
      of the collateral. If the highest bid in the subsequent auction is high
      enough to show that the position is sufficiently collateralized, the
      challenge is averted and the bidder gets the challengers collateral in
      exchange for the highest bid. If the highest bid is lower, the challenge
      is considered successful, the bidder gets the collateral from the position
      and the position is closed, distributing excess proceeds to the reserve
      and paying a reward to the challenger.
    </p>

    <PositionsView></PositionsView>

    <div class="mx-auto my-8 flex w-auto flex-col items-center justify-center">
      <AppPageHeader title="Minting Hub" />
      <AppButton
        full
        tag="a"
        :href="contractUrl(addresses.mintingHub)"
        target="_blank"
        secondary
      >
        {{ shortenAddress(addresses.mintingHub) }}
      </AppButton>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue';

import { contractUrl, shortenAddress } from '@/utils/address.js';
import { addresses } from '@/contracts/dictionnary';

import useAuth from '@/auth';

import PositionsView from '@/views/PositionsView.vue';

import AppPageHeader from '@/components/AppPageHeader.vue';
import AppButton from '@/components/AppButton.vue';
import AppBox from '@/components/AppBox.vue';
import DisplayLabel from '@/components/DisplayLabel.vue';
import DisplayAmount from '@/components/DisplayAmount.vue';

const auth = useAuth();

const { openDialog } = inject('dialog');
const frankencoin = inject('frankencoin');
const equity = inject('equity');
const stablecoin = inject('stablecoin');
</script>
