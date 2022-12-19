<template>
  <div>
    <div class="text-sm text-gray-400">{{ label }}</div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
