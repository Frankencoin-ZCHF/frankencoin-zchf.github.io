<template>
  <component :is="iconComponent" :class="classes" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps({
  icon: {
    type: String,
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['small', 'medium', 'large'].includes(value);
    },
  },
});

const classes = computed(() => ({
  'inline-block': true,
  'w-4 h-4': props.size == 'small',
  'w-6 h-6': props.size == 'medium',
  'w-10 h-10': props.size == 'large',
  'w-full': props.full,
}));

const iconComponent = defineAsyncComponent(() => {
  /* @vite-ignore */
  return import(`@/components/icons/Icon${props.icon}.vue`);
});
</script>
