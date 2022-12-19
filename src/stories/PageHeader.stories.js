import AppPageHeader from '../components/AppPageHeader.vue';

export default {
  title: 'Page/Header',
  component: AppPageHeader,
};

const Template = (args) => ({
  components: { AppPageHeader },
  setup() {
    return { args };
  },
  template: `<AppPageHeader v-bind="args"></AppPageHeader>`,
});

// Stories
const args = {
  title: 'Page title',
  subtitle: 'A subtitle for the page',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
  tight: false,
};
