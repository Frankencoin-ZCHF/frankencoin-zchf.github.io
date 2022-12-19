import AppValueDisplay from '../components/AppValueDisplay.vue';

export default {
  title: 'Data/ValueDisplay',
  component: AppValueDisplay,
};

const Template = (args) => ({
  components: { AppValueDisplay },
  setup() {
    return { args };
  },
  template: `<AppValueDisplay v-bind="args"></AppValueDisplay>`,
});

// Stories
const args = {
  value: 1000000000,
  currency: 'ZCHF',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};
