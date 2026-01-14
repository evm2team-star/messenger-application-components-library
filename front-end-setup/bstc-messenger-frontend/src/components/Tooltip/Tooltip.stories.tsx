import { Tooltip } from "./Tooltip";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="This is a tooltip message">
      <span>Hover or focus me</span>
    </Tooltip>
  ),
};

export const OnButton: Story = {
  render: () => (
    <Tooltip content="Click to submit">
      <button>Submit</button>
    </Tooltip>
  ),
};
