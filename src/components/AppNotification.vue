<template>
  <div
    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl shadow-lg ring-1 ring-black ring-opacity-5"
    :class="bodyClasses"
    @mouseenter="pauseNotification(notification.id)"
    @mouseleave="resumeNotification(notification.id)"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="ml-3 w-0 flex-1 space-y-1 pt-0.5">
          <p class="text-lg font-medium">{{ notification.title }}</p>
          <p class="text-sm" v-if="notification.subtitle">
            {{ notification.subtitle }}
          </p>
          <div class="pt-2">
            <a
              :href="notification.linkUrl"
              target="_blank"
              rel="noopener"
              class="text-sm underline"
              v-if="notification.linkUrl && notification.linkLabel"
            >
              {{ notification.linkLabel }}
            </a>
          </div>
        </div>
        <div class="ml-4 flex flex-shrink-0">
          <div class="-mx-3 -my-2 md:-mx-4 md:-my-4">
            <AppButton
              icon="Close"
              @click="removeNotification(notification.id)"
            ></AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import useNotification from '@/composables/useNotification';
import { computed } from 'vue';

import AppButton from './AppButton.vue';

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const { removeNotification, pauseNotification, resumeNotification } =
  useNotification();

const bodyClasses = computed(() => ({
  'bg-white text-gray-500': !props.notification.type,
  'bg-red text-white': props.notification.type === 'error',
  'bg-green text-white': props.notification.type === 'success',
}));
</script>
