import { Checkbox } from "./Checkbox";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Accept Terms & Conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Subscribed",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Checkbox",
    disabled: true,
  },
};
