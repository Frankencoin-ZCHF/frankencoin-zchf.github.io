import AppButton from '../components/AppButton.vue';

export default {
  title: 'Basic/Button',
  component: AppButton,
  argTypes: {
    onClick: {},
    icon: {
      control: { type: 'select' },
      options: ['Menu'],
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
    size: {
      control: { type: 'select' },
      options: ['medium', 'large'],
    },
    tag: {
      control: { type: 'select' },
      options: ['button', 'a'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
  },
};

const Template = (args) => ({
  components: { AppButton },
  setup() {
    return { args };
  },
  template: `
  <AppButton v-bind="args">
    ${args.label ? args.label : ''} 
  </AppButton>`,
});

// Stories
const args = {
  label: 'Button text',
};

export const Primary = Template.bind({});
Primary.args = {
  ...args,
  primary: true,
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...args,
  secondary: true,
};

export const Menu = Template.bind({});
Menu.args = {
  ...args,
  menu: true,
};

export const Field = Template.bind({});
Field.args = {
  ...args,
  field: true,
};

export const Text = Template.bind({});
Text.args = {
  ...args,
  text: true,
};

export const Link = Template.bind({});
Link.args = {
  ...args,
  link: true,
};

export const LinkPrimary = Template.bind({});
LinkPrimary.args = {
  ...args,
  link: true,
  primary: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...args,
  primary: true,
  icon: 'Menu',
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
  ...args,
  primary: true,
  icon: 'Menu',
  iconPosition: 'right',
};

export const Large = Template.bind({});
Large.args = {
  ...args,
  size: 'large',
  primary: true,
  icon: 'Menu',
};

export const Full = Template.bind({});
Full.args = {
  ...args,
  full: true,
  primary: true,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
  primary: true,
  iconOnly: true,
  icon: 'Menu',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...args,
  primary: true,
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...args,
  primary: true,
  loading: true,
};
