import AppSwapBox from '../components/AppSwapBox/AppSwapBox.vue';

export default {
  title: 'Dynamic/AppSwapBox',
  component: AppSwapBox,
  argTypes: {
    closeButton: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => ({
  components: { AppSwapBox },
  setup() {
    return { args };
  },
  template: `
  <AppSwapBox v-bind="args" title="${args.title}">
    ${args.content}
  </AppSwapBox>
  `,
});

// Stories
const args = {
  ratio: 2,
  currencyFrom: 'ZCHF',
  currencyTo: 'FPS',
  maxFrom: 500,
  maxTo: 60,
  label: 'FPS can be sold after a 30 day lock up period.',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};
