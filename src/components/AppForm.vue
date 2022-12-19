<template>
  <form>
    <slot></slot>
    <div class="mx-auto mt-8 w-72 max-w-full flex-col" v-if="!hideSubmit">
      <AppFormSubmit />
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue';
import blockchain from '@/config';
import useAuth from '@/auth';

import AppFormSubmit from '@/components/AppFormSubmit.vue';

const auth = useAuth();

const hideSubmit = computed(
  () => !auth.isConnected || auth.chainId != blockchain.targetChainId
);
</script>
