import AppPageBlock from '../components/AppPageBlock.vue';

export default {
  title: 'Page/Block',
  component: AppPageBlock,
  argTypes: {
    tight: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => ({
  components: { AppPageBlock },
  setup() {
    return { args };
  },
  template: `<AppPageBlock v-bind="args">${args.lorem}</AppPageBlock>`,
});

// Stories
const args = {
  title: 'Page Block Title',
  lorem:
    'Lorem ipsum <b>dolor sit amet</b>, <a href="#">consectetur</a> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <i>dolore eu fugiat nulla pariatur</i>. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
  tight: false,
};

export const Tight = Template.bind({});
Tight.args = {
  ...args,
  tight: true,
};
