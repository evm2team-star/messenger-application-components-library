import { Dropdown } from "./Dropdown";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    label: "Select Country",
    options: [
      { label: "India", value: "india" },
      { label: "USA", value: "usa" },
      { label: "UK", value: "uk" },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Dropdown",
    disabled: true,
    options: [
      { label: "Option 1", value: "1" },
    ],
  },
};
