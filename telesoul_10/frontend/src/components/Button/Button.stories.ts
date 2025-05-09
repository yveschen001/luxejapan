import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text'],
      description: '按钮变体'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    label: {
      control: 'text',
      description: '按钮文本'
    },
    onClick: { action: 'clicked' }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: '主要按钮'
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: '次要按钮'
  }
}

export const Text: Story = {
  args: {
    variant: 'text',
    label: '文本按钮'
  }
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    label: '禁用按钮',
    disabled: true
  }
} 