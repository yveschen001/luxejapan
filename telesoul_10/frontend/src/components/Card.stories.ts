import Card from './Card.vue';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    title: { control: 'text' },
    footer: { control: 'text' },
  },
};

const Template = (args: any) => ({
  components: { Card },
  setup() { return { args }; },
  template: '<Card v-bind="args">這是卡片內容</Card>',
});

export const Default = Template.bind({});
Default.args = {
  title: '卡片標題',
  footer: '卡片底部',
}; 