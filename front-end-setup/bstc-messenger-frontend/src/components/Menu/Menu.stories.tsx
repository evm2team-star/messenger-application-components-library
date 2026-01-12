import { Menu } from "./Menu";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {
    items: [
      { label: "Profile", onClick: () => alert("Profile clicked") },
      { label: "Settings", onClick: () => alert("Settings clicked") },
      { label: "Logout", onClick: () => alert("Logout clicked") },
    ],
  },
};
