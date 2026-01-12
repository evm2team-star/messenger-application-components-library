import { Loader } from "./Loader";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Loader> = {
  title: "Components/Loader",
  component: Loader,
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};
