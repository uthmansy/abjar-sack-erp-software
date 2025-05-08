import useEditRequest from "../../../hooks/useEditRequest";
import FormBuilder from "../../utils/FormBuilder";
import { RequestWithItems } from "../../../types/db";
import { MdModeEdit } from "react-icons/md";
import { Button, Modal } from "antd";

interface Props {
  request: RequestWithItems;
}

function EditRequest({ request }: Props) {
  const {
    handleCloseModal,
    handleOpenModal,
    isModalOpen,
    formConfig,
    handleSubmit,
    isLoading,
  } = useEditRequest({ request });

  return (
    <>
      <Button onClick={handleOpenModal} type="default" icon={<MdModeEdit />} />
      <Modal
        footer={null}
        title="Edit Request"
        open={isModalOpen}
        onCancel={handleCloseModal}
        width={500}
      >
        <FormBuilder
          formConfig={formConfig}
          onSubmit={handleSubmit}
          loading={isLoading}
          columns={1}
        />
      </Modal>
    </>
  );
}

export default EditRequest;
