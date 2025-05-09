import type { Meta, StoryObj } from '@storybook/vue3'
import Avatar from './Avatar.vue'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '头像图片地址'
    },
    size: {
      control: 'number',
      description: '头像尺寸（px）'
    },
    alt: {
      control: 'text',
      description: '图片描述'
    }
  }
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: '',
    size: 64,
    alt: 'avatar.alt'
  },
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `<Avatar v-bind="args" :alt="$t(args.alt)" />`
  })
}

export const WithImage: Story = {
  args: {
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
    size: 64,
    alt: 'avatar.alt'
  },
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `<Avatar v-bind="args" :alt="$t(args.alt)" />`
  })
} 