<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:p-6"
  >
    <div class="flex w-full flex-col items-end space-y-4">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 sm:translate-y-0 sm:translate-x-2"
      >
        <AppNotification
          v-for="(notification, index) in notifications"
          :key="index"
          :notification="notification"
        ></AppNotification>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import useNotification from '@/composables/useNotification';

import AppNotification from './AppNotification.vue';

const { notifications } = useNotification();
</script>
