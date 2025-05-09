import type { Meta, StoryObj } from '@storybook/vue3'
import Modal from './Modal.vue'
import { ref } from 'vue'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '是否显示弹窗'
    },
    title: {
      control: 'text',
      description: '弹窗标题'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '弹窗尺寸'
    }
  }
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'components.modal.title',
    size: 'md'
  },
  render: (args) => ({
    components: { Modal },
    setup() {
      const open = ref(true)
      return { args, open, handleClose: () => (open.value = false) }
    },
    template: `<Modal v-bind="args" :isOpen="open" @close="handleClose">{{ $t('components.modal.content') }}</Modal>`
  })
} 