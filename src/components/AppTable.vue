<template>
  <section>
    <div class="space-y-3">
      <AppTableHeader :columns="columns" />
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:gap-2">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppTableHeader from '@/components/AppTableHeader.vue';

defineProps({
  columns: Array,
});
</script>
