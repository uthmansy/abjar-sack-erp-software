import { useState } from "react";
import { FieldConfig } from "../types/comps";
import { App } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { ZodError } from "zod";
import { updateRequest } from "../helpers/apiFunctions";
import { RequestWithItems } from "../types/db";
import dayjs from "dayjs";
import { valueType } from "antd/es/statistic/utils";
import { UpdateRequestSchema } from "../zodSchemas/requests";

interface HookReturn {
  isModalOpen: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  formConfig: FieldConfig[];
  handleSubmit: (values: any) => void;
  isLoading: boolean;
}

interface Prop {
  request: RequestWithItems;
}

function useEditRequest({ request }: Prop): HookReturn {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const formConfig: FieldConfig[] = [
    {
      name: "date_used",
      label: "Used Date",
      type: "date",
      required: false,
      defaultValue: (dayjs(request.date_used, "YYYY-MM-DD") ||
        undefined) as unknown as valueType,
    },
  ];

  const { mutate: handleSubmit, isLoading } = useMutation({
    mutationFn: async (values: any) => {
      try {
        if (values.date_used)
          values.date_used = values.date_used.format("YYYY-MM-DD");
        values.id = request.id;
        const payload = await UpdateRequestSchema.parseAsync(values);
        await updateRequest(payload);
      } catch (error) {
        if (error instanceof ZodError) {
          console.error("Validation failed:", error.errors);
          throw error;
        }
        throw new Error(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    onError: (error: Error) => {
      message.error(error.message || "Failed to update");
    },
    onSuccess: () => {
      message.success("updated successfully");
      handleCloseModal();
      queryClient.invalidateQueries();
    },
  });

  return {
    isModalOpen,
    handleCloseModal,
    handleOpenModal,
    formConfig,
    handleSubmit,
    isLoading,
  };
}

export default useEditRequest;
