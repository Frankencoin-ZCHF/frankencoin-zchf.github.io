<template>
  <AppNotificationsGroup />

  <div class="mx-auto max-w-6xl space-y-8 px-4 pb-8 md:px-8 2xl:max-w-7xl">
    <TheHeader />

    <main>
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import useAuth from '@/auth';
import AppNotificationsGroup from '@/components/AppNotificationsGroup.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';
import useDialog from '@/composables/useDialog';
import useLoading from '@/composables/useLoading';
import useAppController from '@/controllers/useAppController';
import { provide } from 'vue';

const { loading } = useLoading();
const auth = useAuth();

useAppController();

useDialog();

provide('auth', auth);
provide('loading', loading);
</script>
