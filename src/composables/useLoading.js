import { computed, ref, watch } from 'vue';
import { createGlobalState } from '@vueuse/core';

export default createGlobalState(() => {
  const requests = ref({});
  const loading = ref(false);

  const initRequest = (key, message) => {
    requests.value[key] = message;
  };

  const endRequest = (key) => {
    delete requests.value[key];
  };

  const hasRequests = computed(() => !!Object.keys(requests.value).length);

  watch(hasRequests, () => {
    if (hasRequests.value) {
      loading.value = true;
    } else {
      window.setTimeout(() => {
        if (!hasRequests.value) loading.value = false;
      }, 25);
    }
  });

  // const loading = computed(() => !!Object.keys(requests.value).length);

  return {
    initRequest,
    endRequest,
    loading,
    hasRequests,
    requests,
  };
});
