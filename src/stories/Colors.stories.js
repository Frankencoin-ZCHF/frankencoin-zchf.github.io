export default {
  title: 'Default/Colors',
};

const Template = (args) => ({
  setup() {
    return { args };
  },
  template: `
  <div class="grid grid-cols-4 gap-4 text-center text-white uppercase">
    <div class="bg-black p-8">Black</div>
    <div class="bg-white text-black p-8 border border-black">White</div>
    <div class="bg-gray-100 text-black p-8 border border-black">Gray 100</div>
    <div class="bg-gray-200 text-black p-8">Gray 200</div>
    <div class="bg-gray-500 p-8">Gray 500</div>
    <div class="bg-neutral-100 text-black p-8 border border-black">Neutral 100</div>
    <div class="bg-neutral-200 text-black p-8">Neutral 200</div>
  </div>
  `,
});

export const Default = Template.bind({});
