<template>
  <section class="flex grid-cols-8 flex-col gap-2 py-4 sm:flex-row lg:grid">
    <div>
      <AppButton link :to="backTo" v-if="backText && backTo">
        {{ backText }}
      </AppButton>
    </div>

    <h1
      class="font-xl col-span-6 flex-1 text-center text-xl font-bold"
      v-if="title"
    >
      <a :href="link" target="_blank" class="text-link" v-if="link">
        {{ title }}
      </a>
      <template v-else>{{ title }}</template>
    </h1>
  </section>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';

defineProps({
  title: String,
  align: {
    type: String,
    default: 'center',
  },
  link: String,
  backText: String,
  backTo: String,
});
</script>
