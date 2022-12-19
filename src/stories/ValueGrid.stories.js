import AppValueGrid from '../components/AppValueGrid.vue';

export default {
  title: 'Data/ValueGrid',
  component: AppValueGrid,
};

const Template = (args) => ({
  components: { AppValueGrid },
  setup() {
    return { args };
  },
  template: `<AppValueGrid v-bind="args"></AppValueGrid>`,
});

// Stories
const args = {
  entries: [
    {
      label: 'Supply',
      value: 200,
      currency: 'FPS',
    },
    {
      label: 'Value',
      value: 50000,
      currency: 'ZCHF',
    },
    {
      label: 'Stake',
      value: 5.6,
      currency: '%',
    },
    {
      label: 'Contract',
      value: 'ob2xAoPo2..XZy',
      href: 'https://liip.ch',
      target: '_blank',
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};
