export default {
  title: 'Default/Texts',
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  template: `
  <p>Normal: ${args.lorem}</p>
  <p class="text-sm">Small: ${args.lorem}</p>
  <p class="text-lg">Large: ${args.lorem}</p>
  `,
});

// Stories
const args = {
  lorem:
    'Lorem ipsum <b>dolor sit amet</b>, <a href="#">consectetur</a> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum <i>dolore eu fugiat nulla pariatur</i>. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};
