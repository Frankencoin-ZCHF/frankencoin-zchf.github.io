<template>{{ remainingTime }}</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isExpired: Boolean,
  remaining: String,
});

const remainingTime = computed(() => {
  return props.isExpired ? '-' : props.remaining;
});
</script>
