<template>
  <ul class="mt-12 flex items-center justify-center gap-8">
    <li v-if="route.meta.documentation">
      <AppButton
        link
        tag="a"
        target="_blank"
        icon="Documentation"
        :href="route.meta.documentation"
      >
        Documentation
      </AppButton>
    </li>

    <li>
      <AppButton
        link
        tag="a"
        target="_blank"
        icon="Github"
        href="https://github.com/Frankencoin-ZCHF"
      >
        GitHub
      </AppButton>
    </li>
  </ul>
</template>

<script setup>
import AppButton from '@/components/AppButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
