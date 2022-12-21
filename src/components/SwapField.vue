<template>
  <div>
    <div class="mb-1 flex gap-2 px-1 font-bold">
      <div class="flex-1">
        {{ label }}
      </div>

      <div
        class="flex gap-2"
        :class="{ 'cursor-pointer underline': hasMax && clickableMax }"
        @click="setMax()"
        v-if="auth.isConnected && symbol && hasMax && !loading"
      >
        <div v-if="hasMax && !hideMaxLabel" class="flex items-center gap-2">
          <AppIcon icon="Wallet" size="small" v-if="fromWallet" />
          {{ formatCommify(max) }}
          {{ symbol }}
        </div>

        <div class="inline sm:hidden" v-else>{{ symbol }}</div>
      </div>
    </div>

    <div class="flex items-center rounded-lg bg-neutral-200 p-2">
      <div class="flex-1">
        <slot></slot>
      </div>

      <div class="hidden w-20 px-4 text-end font-bold sm:block">
        {{ symbol }}
      </div>
    </div>

    <div class="mt-2 px-1">
      <slot name="note">{{ note }}</slot>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { formatCommify } from '@/utils/formatNumber';
import AppIcon from '@/components/AppIcon.vue';

const emit = defineEmits(['setMax']);

const loading = inject('loading');
const auth = inject('auth');

const props = defineProps({
  label: String,
  test: String,
  symbol: String,
  max: [Number, String],
  note: String,
  fromWallet: Boolean,
  clickableMax: Boolean,
  hideMaxLabel: {
    type: Boolean,
    default: false,
  },
});

const hasMax = computed(() => props.max !== null);

const setMax = () => {
  if (hasMax.value) emit('setMax');
};
</script>
