<template>
  <component :is="tag" class="mb-3 text-lg lg:mb-0">{{ text }}</component>
</template>

<script setup>
defineProps({
  text: String,
  tag: {
    type: String,
    default: 'h2',
  },
});
</script>
