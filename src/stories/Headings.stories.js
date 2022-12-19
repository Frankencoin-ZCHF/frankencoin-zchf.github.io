export default {
  title: 'Default/Headings',
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  template: `
  <h1 ${args.class ? args.class : ''}>H1 ${args.title}</h1>
  <h2 ${args.class ? args.class : ''}>H2 ${args.title}</h2>
  <h3 ${args.class ? args.class : ''}>H3 ${args.title}</h3>
  <h4 ${args.class ? args.class : ''}>H4 ${args.title}</h4>
  <h5 ${args.class ? args.class : ''}>H5 ${args.title}</h5>
  <h6 ${args.class ? args.class : ''}>H6 ${args.title}</h6>
  `,
});

// Stories
const args = {
  title: 'The quick brown fox jumps over the lazy dog',
};

export const Default = Template.bind({});
Default.args = {
  ...args,
};

export const Bold = Template.bind({});
Bold.args = {
  ...args,
  class: 'class="font-bold"',
};
