import Modal from './Modal.vue';

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    size: { control: 'text' },
  },
};

const Template = (args: any) => ({
  components: { Modal },
  setup() { return { args }; },
  template: '<Modal v-bind="args" @close="args.isOpen = false">這是彈窗內容</Modal>',
});

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  title: '彈窗標題',
  size: '',
}; 