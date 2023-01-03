import { computed, ref } from 'vue';

export default ({ currencyA, currencyB }) => {
  const isReversed = ref(false);

  const from = computed(() => {
    if (isReversed.value) {
      return currencyB.value;
    } else {
      return currencyA.value;
    }
  });

  const to = computed(() => {
    if (isReversed.value) {
      return currencyA.value;
    } else {
      return currencyB.value;
    }
  });

  const switchDirection = () => {
    isReversed.value = !isReversed.value;
  };

  return {
    from,
    to,
    isReversed,
    switchDirection,
  };
};
