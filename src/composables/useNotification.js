import Timeout from 'smart-timeout';
import { ref } from 'vue';

const notifications = ref([]);

const defaultOptions = {
  title: 'Message',
  delay: 6000,
};

const addNotification = (options) => {
  const id = Date.now();

  const notification = {
    id: id,
    ...defaultOptions,
    ...options,
  };

  notifications.value.push(notification);

  if (!isNaN(notification.delay) && notification.delay > 0) {
    Timeout.set(id, () => removeNotification(id), notification.delay);
  }
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex((x) => x.id === id);

  if (Timeout.pending(id)) {
    Timeout.clear(id);
  }

  notifications.value.splice(index, 1);
};

const pauseNotification = (id) => {
  if (Timeout.exists(id) && Timeout.pending(id)) {
    Timeout.pause(id);
  }
};

const resumeNotification = (id) => {
  if (Timeout.exists(id) && Timeout.paused(id)) {
    Timeout.resume(id);
  }
};

export default () => ({
  notifications,
  addNotification,
  removeNotification,
  pauseNotification,
  resumeNotification,
});
