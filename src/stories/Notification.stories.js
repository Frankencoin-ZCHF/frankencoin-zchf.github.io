import AppNotificationsGroup from '../components/AppNotificationsGroup.vue';
import AppButton from '../components/AppButton.vue';
import useNotification from '../composables/useNotification';

export default {
  title: 'Dynamic/Notification',
  component: AppNotificationsGroup,
  argTypes: {
    onClick: {},
    type: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
  },
};

const Template = (args) => ({
  components: { AppNotificationsGroup, AppButton },
  setup() {
    return { args };
  },
  methods: {
    addNotification: () => {
      useNotification().addNotification(args);
    },
  },
  template: `
  <AppButton primary outline @click="addNotification()">
    Add a notification
  </AppButton>

  <AppNotificationsGroup></AppNotificationsGroup>
  `,
});

// Stories

const args = {
  title: 'Successfully saved!',
  subtitle: 'Anyone with a link can now view this file',
  linkUrl: 'https://www.liip.ch/fr',
  linkLabel: 'See transaction',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  ...args,
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  ...args,
};

export const AutoExpiration = Template.bind({});
AutoExpiration.args = {
  delay: 10000,
  ...args,
};
