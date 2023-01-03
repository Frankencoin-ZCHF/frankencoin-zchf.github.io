import { provide, ref } from 'vue';

export default () => {
  const dialogs = ref({});

  const openDialog = (key) => {
    dialogs.value[key] = true;
  };

  const closeDialog = (key) => {
    dialogs.value[key] = false;
  };

  provide('dialog', {
    dialogs,
    openDialog,
    closeDialog,
  });
};
