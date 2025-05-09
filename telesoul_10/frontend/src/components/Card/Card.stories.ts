import type { Meta, StoryObj } from '@storybook/vue3'
import Card from './Card.vue'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '卡片标题'
    },
    ariaLabel: {
      control: 'text',
      description: '无障碍标签'
    }
  }
} satisfies Meta<typeof Card>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    title: 'components.card.title'
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `<Card v-bind="args">{{ $t('components.card.content') }}</Card>`
  })
}

export const WithFooter: StoryObj<typeof meta> = {
  args: {
    title: 'components.card.title'
  },
  render: (args) => ({
    components: { Card },
    setup: () => ({ args }),
    template: `<Card v-bind="args"><template #footer>{{ $t('components.card.footer') }}</template>{{ $t('components.card.content') }}</Card>`
  })
} 