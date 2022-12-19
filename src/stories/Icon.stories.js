import AppIcon from '../components/AppIcon.vue';

export default {
  title: 'Basic/Icon',
  component: AppIcon,
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: ['Menu'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    outlined: {
      control: { type: 'boolean' },
    },
  },
};

const Template = (args) => ({
  components: { AppIcon },
  setup() {
    return { args };
  },
  template: `
  <AppIcon v-bind="args"></AppIcon>`,
});

// Stories
const args = {
  icon: 'Menu',
};

export const Medium = Template.bind({});
Medium.args = {
  ...args,
  size: 'medium',
};

export const Large = Template.bind({});
Large.args = {
  ...args,
  size: 'large',
};

export const Small = Template.bind({});
Small.args = {
  ...args,
  size: 'small',
};
