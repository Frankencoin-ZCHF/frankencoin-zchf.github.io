<template>
  <div class="text-gray-400 md:hidden">{{ text }}</div>
</template>

<script setup>
defineProps({
  text: String,
});
</script>
