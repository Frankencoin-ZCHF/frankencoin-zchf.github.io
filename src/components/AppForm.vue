<template>
  <form>
    <slot></slot>
    <div class="mx-auto mt-8 w-72 max-w-full flex-col">
      <AppFormSubmit />
    </div>
  </form>
</template>

<script setup>
import AppFormSubmit from '@/components/AppFormSubmit.vue';
</script>
