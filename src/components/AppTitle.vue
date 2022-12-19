<template>
  <component :is="tag" class="mb-8 text-4xl">{{ text }}</component>
</template>

<script setup>
defineProps({
  text: String,
  tag: {
    type: String,
    default: 'h1',
  },
});
</script>
