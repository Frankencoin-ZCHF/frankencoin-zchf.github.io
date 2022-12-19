<template>
  <div class="flex gap-x-2 leading-none">
    <div
      class="h-4 w-4 flex-shrink-0 rounded-full"
      :class="{ 'bg-gray-300': isExpired, 'bg-green': !isExpired }"
    ></div>
    <div class="flex flex-col gap-y-1">
      <span class="font-bold">{{ isExpired ? 'Expired' : 'Active' }}</span>
      <span class="text-sm">
        <template v-if="!isExpired">expires</template>
        {{ date }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isExpired: Boolean,
  date: String,
});
</script>
