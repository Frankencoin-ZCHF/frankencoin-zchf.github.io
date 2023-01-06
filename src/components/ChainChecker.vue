<template>
  <div
    class="rounded bg-neutral-100 px-2 py-4 text-center text-red"
    v-if="wrongChain"
  >
    <template v-if="!short">
      Your wallet is connected to an unsupported chain.
      <br class="md:hidden" />
    </template>
    Please switch to
    <b>{{ blockchain.targetChainName }}.</b>
  </div>
</template>

<script setup>
import useAuth from '@/auth';
import blockchain from '@/config';
import { computed } from 'vue';

const auth = useAuth();

defineProps({
  short: Boolean,
});

const wrongChain = computed(
  () => auth.isConnected && auth.chainId != blockchain.targetChainId
);
</script>
