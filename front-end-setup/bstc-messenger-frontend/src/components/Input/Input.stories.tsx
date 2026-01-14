import { Input } from "./Input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Name",
    placeholder: "Enter your name",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    label: "Password",
    placeholder: "Required field",
    error: true,
  },
};
