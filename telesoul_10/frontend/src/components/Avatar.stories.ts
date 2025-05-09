import Avatar from './Avatar.vue';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    src: { control: 'text' },
    size: { control: 'number' },
    alt: { control: 'text' },
  },
};

const Template = (args: any) => ({
  components: { Avatar },
  setup() { return { args }; },
  template: '<Avatar v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  src: 'https://placehold.co/80x80',
  size: 40,
  alt: '頭像',
}; 