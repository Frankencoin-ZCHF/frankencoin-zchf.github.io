<template>
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2 font-bold">
      <div class="w-6 text-center">
        <AppIcon icon="Loader" v-if="loading"></AppIcon>
        <div class="m-auto h-2 w-2 rounded-full bg-green" v-else></div>
      </div>
      <span class="font-bold">{{ blockchain.targetChainShortName }}</span>
    </div>

    <div v-if="!auth.isConnected">
      <AppDialog dialog="walletConnect" title="Connect your wallet">
        <div class="flex flex-col gap-4">
          <AppButton secondary full @click="handleClick('metamask')">
            <span class="flex gap-4">
              <img src="/icons/metamask.svg" class="h-5 w-5" />
              Metamask
            </span>
          </AppButton>

          <AppButton secondary full @click="handleClick('walletConnect')">
            <span class="flex gap-4">
              <img src="/icons/wallet-connect.svg" class="h-7 w-7" />
              Wallet Connect
            </span>
          </AppButton>
        </div>
      </AppDialog>

      <AppButton primary @click="openDialog('walletConnect')">
        Connect <span class="hidden xl:inline">Wallet</span>
      </AppButton>
    </div>

    <template v-else>
      <AppButton text icon-position="right" icon="User" @click="logout()">
        {{ shortenAddress(auth.wallet) }}
      </AppButton>
    </template>
  </div>
</template>

<script setup>
import { inject } from 'vue';

import blockchain from '@/config';
import useAuth from '@/auth';

import useWallet from '@/composables/useWallet';
import AppButton from '@/components/AppButton.vue';
import AppDialog from '@/components/AppDialog.vue';
import AppIcon from '@/components/AppIcon.vue';

import { shortenAddress } from '@/utils/address.js';

const auth = useAuth();

const { openDialog, closeDialog } = inject('dialog');
const { login, logout } = useWallet();
const loading = inject('loading');

const handleClick = (connector) => {
  login(connector);
  closeDialog('walletConnect');
};
</script>
