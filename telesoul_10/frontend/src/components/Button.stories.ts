import Button from './Button.vue';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args: any) => ({
  components: { Button },
  setup() { return { args }; },
  template: `<Button v-bind="args">{{$t(args.label)}}</Button>`,
});

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  disabled: false,
  label: 'button.primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  disabled: false,
  label: 'button.secondary',
};

export const Text = Template.bind({});
Text.args = {
  variant: 'text',
  disabled: false,
  label: 'button.text',
}; 