import useNotification from '@/composables/useNotification';

const { addNotification } = useNotification();

export default () => {
  const executeTransaction = async (tx, callback) => {
    try {
      const t = await tx();
      await t.wait();

      if (callback) callback(t);

      return t;
    } catch (e) {
      console.log(e);

      addNotification({
        type: 'error',
        title: 'Error',
        subtitle: e.reason,
      });

      return { error: e };
    }
  };

  return {
    executeTransaction,
  };
};
