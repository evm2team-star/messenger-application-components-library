import { useState } from "react";
import { Modal } from "./Modal";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Modal
        isOpen={open}
        title="Example Modal"
        onClose={() => setOpen(false)}
      >
        <p>This is a reusable modal component.</p>
      </Modal>
    );
  },
};
