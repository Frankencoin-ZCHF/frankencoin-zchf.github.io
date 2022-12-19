<template>
  <template v-if="columns.length > 0">
    <div
      class="hidden items-center justify-between rounded-lg bg-white py-5 px-8 md:flex xl:px-16"
    >
      <div
        class="hidden flex-grow grid-cols-2 items-center text-gray-300 md:grid"
        :class="`md:grid-cols-${columns.length}`"
      >
        <template v-for="(label, index) in columns" :key="index">
          <span class="leading-tight">{{ label }}</span>
        </template>
      </div>
      <div class="w-40 flex-shrink-0"></div>
    </div>
  </template>
</template>

<script setup>
defineProps({
  columns: Array,
});
</script>
