<template>
  <AppButton
    secondary
    full
    :disabled="loading"
    @click="openDialog('walletConnect')"
    v-if="!auth.isConnected"
  >
    Connect wallet
  </AppButton>

  <AppButton
    secondary
    full
    :disabled="disabled || loading || !!error"
    :loading="pending"
    @click="allow"
    v-else-if="!allowed && needsAllowance"
  >
    Approve
  </AppButton>

  <AppButton
    primary
    full
    tag="button"
    type="submit"
    @click="submit"
    :disabled="disabled || loading || !!error"
    :loading="pending"
    v-else
  >
    {{ cta }}
  </AppButton>

  <div
    class="mt-4 text-center text-sm font-semibold leading-tight text-red"
    v-if="error && !loading && auth.isConnected"
  >
    {{ error.message }}
  </div>
</template>

<script setup>
import useAuth from '@/auth';
import AppButton from '@/components/AppButton.vue';
import useLoading from '@/composables/useLoading';
import blockchain from '@/config';
import { computed, inject } from 'vue';

const auth = useAuth();
const { openDialog } = inject('dialog');

const wrongChain = computed(() => auth.chainId != blockchain.targetChainId);

const needsAllowance = inject('needsAllowance', false);
const disabled = inject('disabled') && wrongChain;
const pending = inject('pending');
const allowed = !needsAllowance ? true : inject('allowed');
const error = inject('error');
const allow = !needsAllowance ? null : inject('allow');
const submit = inject('submit');

const { loading } = useLoading();

defineProps({
  cta: {
    type: String,
    default: 'Confirm',
  },
});
</script>
