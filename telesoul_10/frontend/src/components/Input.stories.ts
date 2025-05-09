import Input from './Input.vue';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'text' },
  },
};

const Template = (args: any) => ({
  components: { Input },
  setup() { return { args, value: '' }; },
  template: `<Input v-bind="args" v-model="value" :placeholder="$t(args.placeholder)" :error="$t(args.error)" />`,
});

export const Default = Template.bind({});
Default.args = {
  placeholder: 'input.placeholder',
  error: '',
  disabled: false,
  type: 'text',
}; 