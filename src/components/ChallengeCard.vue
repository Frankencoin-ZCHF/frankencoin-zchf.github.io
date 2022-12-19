<template>
  <div class="rounded-lg bg-white p-8 xl:px-16">
    <div
      class="flex flex-col justify-between gap-y-5 md:flex-row md:items-center md:space-x-4"
    >
      <div class="grid flex-grow grid-cols-2 items-center gap-3 md:grid-cols-4">
        <div>
          <div class="text-gray-400 md:hidden">Auctionned Collateral</div>
          <div class="leading-none">
            <span class="text-lg font-bold">10</span>
            ETH
          </div>
        </div>

        <div>
          <div class="text-gray-400 md:hidden">Highest Bid</div>
          <div class="space-y-2 leading-none">
            <div>
              <span class="text-lg font-bold">20000</span>
              ZCHF
            </div>
            <span>2’000 ZCHF = 1 ETH</span>
          </div>
        </div>

        <div>
          <div class="text-gray-400 md:hidden">Buy now Price</div>
          <div class="leading-none">
            <span class="text-lg font-bold">1000</span>
            ZCHF
          </div>
        </div>

        <div>
          <div class="text-gray-400 md:hidden">Expires in</div>
          <div class="leading-none">
            <span class="text-lg font-bold">1 d 2 h</span>
          </div>
        </div>

        <div>
          <div class="text-gray-400 md:hidden">State</div>
          <div class="flex">
            <span class="h-4 w-4 flex-shrink-0 rounded-full bg-green"></span>
            <div class="space-y-2 leading-none">
              <span class="text-lg font-bold">Active</span>
              <span>Expires 2022-12-02</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 md:w-40">
        <AppButton primary full size="small">Bid</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
</script>
