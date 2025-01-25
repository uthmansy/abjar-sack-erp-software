// EditPurchase.tsx
import { Button, Modal } from "antd";
import useEditPurchase from "../../../hooks/useEditPurchase";
import FormBuilder from "../../utils/FormBuilder";
import { PurchasesAndPayments } from "../../../types/db";
import { MdModeEdit } from "react-icons/md";

interface Props {
  purchase: PurchasesAndPayments;
}

function EditPurchase({ purchase }: Props) {
  const {
    handleCloseModal,
    handleOpenModal,
    isModalOpen,
    formConfig,
    handleSubmit,
    isLoading,
  } = useEditPurchase({ purchase });

  return (
    <>
      <Button onClick={handleOpenModal} type="default">
        <MdModeEdit />
      </Button>
      <Modal
        footer={null}
        title="Edit Purchase"
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={800}
      >
        <FormBuilder
          formConfig={formConfig}
          onSubmit={handleSubmit}
          loading={isLoading}
          columns={2}
        />
      </Modal>
    </>
  );
}

export default EditPurchase;
