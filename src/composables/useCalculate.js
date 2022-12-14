import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';

export default ({ calcul, amount, result, blockCalculation }) => {
  const isCalculating = ref(false);

  const calculate = useDebounceFn(async () => {
    isCalculating.value = true;

    if (blockCalculation.value) {
      result.value = '0';
    } else {
      result.value = await calcul.value(amount);
    }

    isCalculating.value = false;
  });

  return { calculate, isCalculating };
};
