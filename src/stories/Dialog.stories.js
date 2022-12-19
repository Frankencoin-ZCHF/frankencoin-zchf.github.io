import AppDialog from '../components/AppDialog.vue';
import AppButton from '../components/AppButton.vue';
import useDialog from '../composables/useDialog';

export default {
  title: 'Dynamic/Dialog',
  component: AppDialog,
  argTypes: {
    closeButton: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => ({
  components: { AppDialog, AppButton },
  setup() {
    return { args };
  },
  methods: {
    openDialog: (t) => {
      useDialog().openDialog(t);
    },
  },
  template: `
  <AppButton primary outline @click="openDialog('${args.dialog}')">
    Open dialog
  </AppButton>

  <AppDialog v-bind="args" title="${args.title}">
    ${args.content}
  </AppDialog>
  `,
});

// Stories
const args = {
  dialog: 'dialog-name',
  title: 'Modal title',
  closeButton: true,
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};
