import type { Meta, StoryObj } from '@storybook/react'

import { RemoveAvatarButton } from '@/shared/ui/removeButton/RemoveAvatarButton'

const meta: Meta<typeof RemoveAvatarButton> = {
  component: RemoveAvatarButton,
  title: 'Example/roundRedBtn',
}

export default meta
type Story = StoryObj<typeof RemoveAvatarButton>

export const RoundRedButton: Story = {
  args: {},
}
