<template>
  <div class="mx-auto max-w-6xl 2xl:max-w-7xl">
    <header class="flex items-center py-2 sm:gap-x-4 md:py-4">
      <AppButton
        icon="Menu"
        class="-mr-3 md:-mr-4 md:hidden"
        @click="openDialog('mobileMenu')"
      />

      <RouterLink class="xl:-ml-12" to="/">
        <img
          class="h-9 transition"
          :class="{ 'scale-0': route.name == 'home' }"
          src="@/assets/logoSquare.svg"
        />
      </RouterLink>

      <ul class="justify-left hidden flex-1 gap-2 md:flex lg:gap-3 xl:w-1/2">
        <li>
          <AppButton menu to="/swap">Swap</AppButton>
        </li>

        <li>
          <AppButton menu to="/positions">Positions</AppButton>
        </li>

        <li>
          <AppButton menu to="/pool">Reserve Pool</AppButton>
        </li>

        <li>
          <AppButton menu to="/auctions">Auctions</AppButton>
        </li>
      </ul>

      <div class="flex flex-1 justify-end">
        <WalletConnection />

        <AppDialog dialog="mobileMenu" title="Navigate">
          <ul class="flex flex-col gap-4">
            <li>
              <RouterLink to="/" @click="closeDialog('mobileMenu')">
                <img class="m-auto h-9" src="@/assets/logoSquare.svg" />
              </RouterLink>
            </li>
            <li>
              <AppButton
                full
                menu
                to="/swap"
                @click="closeDialog('mobileMenu')"
              >
                Swap
              </AppButton>
            </li>

            <li>
              <AppButton
                full
                menu
                to="/positions"
                @click="closeDialog('mobileMenu')"
              >
                Positions
              </AppButton>
            </li>

            <li>
              <AppButton
                full
                menu
                to="/pool"
                @click="closeDialog('mobileMenu')"
              >
                Reserve Pool
              </AppButton>
            </li>

            <li>
              <AppButton
                full
                menu
                to="/auctions"
                @click="closeDialog('mobileMenu')"
              >
                Auctions
              </AppButton>
            </li>
          </ul>
        </AppDialog>
      </div>
    </header>

    <ChainChecker />
  </div>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import AppDialog from '@/components/AppDialog.vue';
import ChainChecker from '@/components/ChainChecker.vue';
import WalletConnection from '@/components/WalletConnection.vue';
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const { openDialog, closeDialog } = inject('dialog');
const route = useRoute();
</script>
