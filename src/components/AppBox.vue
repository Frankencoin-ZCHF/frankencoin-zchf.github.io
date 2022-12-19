<template>
  <section class="rounded-xl" :class="cssClass">
    <h2 class="h6 mb-6 text-center font-bold md:mb-8" v-if="title">
      {{ title }}
    </h2>

    <slot></slot>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  tight: Boolean,
  gray: Boolean,
});

const cssClass = computed(() => ({
  'bg-white': !props.gray,
  'bg-gray-100': props.gray,
  'p-4 sm:p-6 md:p-8': !props.tight,
  'p-4': props.tight,
}));
</script>
