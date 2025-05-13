import { FieldConfig, SelectOption } from "../types/comps";
import { App } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ZodError } from "zod";
import {
  createDispatch,
  getAllUncompletedSales,
  getPurchaseItems,
  getUncompletedInventoryTransfers,
  getWarehouses,
} from "../helpers/apiFunctions";
import {
  inventoryTransfersKeys,
  purchasesKeys,
  salesKeys,
  warehousesKeys,
} from "../constants/QUERY_KEYS";

import {
  InventoryTransferWithStocks,
  PurchaseItemsJoined,
  SalesAndPayments,
  SalesItemsJoined,
} from "../types/db";
import useDispatchStore from "../store/dispatch";
import useAuthStore from "../store/auth";
import { STATES } from "../constants/ENUMS";
import { useEffect, useState } from "react";
import { DispatchSchema } from "../zodSchemas/dispatch";

interface HookReturn {
  formConfig: FieldConfig[];
  handleSubmit: (values: any) => void;
  isLoading: boolean;
}

function useDispatchForm(): HookReturn {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { setNewDispatchVehicle, nextPage, dispatchType, originType } =
    useDispatchStore();
  const { userProfile } = useAuthStore();

  const { data: destinations } = useQuery({
    queryKey: warehousesKeys.getDispatchWarehousesWithId,
    queryFn: async (): Promise<SelectOption[]> => {
      const warehouses = await getWarehouses();
      return warehouses.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
      }));
    },
    onError: () => {
      message.error("Failed to Load Inventory warehouses");
    },
  });

  const { data: saleOrders } = useQuery({
    queryKey: salesKeys.getUncompletedSales,
    queryFn: async (): Promise<SalesAndPayments[]> => {
      const orders = await getAllUncompletedSales();
      return orders;
    },
    onError: () => {
      message.error("Failed to Load Inventory warehouses");
    },
  });

  const { data: transferOrders } = useQuery({
    queryKey: inventoryTransfersKeys.getAllInventoryTransfers,
    queryFn: async (): Promise<InventoryTransferWithStocks[]> => {
      const orders = await getUncompletedInventoryTransfers();
      return orders;
    },
    onError: () => {
      message.error("Failed to Load Inventory warehouses");
    },
  });
  const { data: purchaseItems } = useQuery({
    queryKey: purchasesKeys.getAllPurchaseItems,
    queryFn: async (): Promise<PurchaseItemsJoined[]> => {
      const items = await getPurchaseItems();
      return items;
    },
    onError: () => {
      message.error("Failed to Load Purchase Items");
    },
  });

  const [filteredOrders, setFilteredOrders] = useState<SalesAndPayments[]>([]);
  const [salesItems, setSalesItems] = useState<SalesItemsJoined[]>([]);
  const [transferItems, setTransferItems] = useState<
    InventoryTransferWithStocks[]
  >(transferOrders || []);

  useEffect(() => {
    const filteredOrders =
      originType === "external"
        ? saleOrders?.filter((order) => order.type === "external")
        : saleOrders?.filter((order) => {
            if (userProfile?.warehouse) {
              return (
                order.type === "internal" &&
                order.warehouse === userProfile.warehouse
              );
            } else {
              return order.type === "internal";
            }
          });
    setFilteredOrders(filteredOrders || []);
  }, [saleOrders]);

  const formConfig: FieldConfig[] = [
    ...((dispatchType === "purchase" || dispatchType === "transfer"
      ? [
          {
            name: "v_destination",
            label: "Destination Warehouse",
            type: "select",
            options: destinations || [],
            required: true,
            onSelect: (value: string) =>
              setTransferItems(
                transferOrders?.filter(
                  (order) => order.destinationStock.warehouse_info.id === value
                ) || []
              ),
          },
        ]
      : []) as FieldConfig[]),
    ...((dispatchType === "sale"
      ? [
          {
            name: "v_sale_order_number",
            label: "Sale Order",
            type: "select",
            options:
              filteredOrders?.map((order) => ({
                label: `${order.customer_name} - ${order.order_number}`,
                value: order.order_number,
              })) || [],
            required: true,
            onSelect: (value: string) =>
              setSalesItems(
                filteredOrders.find((order) => order.order_number === value)
                  ?.items || []
              ),
          },
        ]
      : []) as FieldConfig[]),
    ...((dispatchType === "sale"
      ? [
          {
            name: "v_destination_address",
            label: "Destination Address",
            type: "text",
            required: false,
          },
        ]
      : []) as FieldConfig[]),
    {
      name: "v_date_dispatched",
      label: "Date",
      type: "date",
      required: true,
    },

    {
      name: "v_origin_state",
      label: "Origin State",
      type: "select",
      options: STATES.map((state) => ({
        label: state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
        value: state,
      })),
      required: true,
    },
    {
      name: "v_driver_name",
      label: "Driver Name",
      type: "text",
      required: true,
    },
    {
      name: "v_driver_number",
      label: "Driver Number",
      type: "text",
      required: true,
      rules: [
        {
          pattern: /^[0-9]{11}$/,
          message: "Phone Number must be 11 digits and contain numbers only",
        },
      ],
    },
    ...((originType === "external"
      ? [
          {
            name: "v_other_waybill_number",
            label: "Other Waybill Number",
            type: "text",
            required: false,
          },
        ]
      : []) as FieldConfig[]),
    {
      name: "v_transporter",
      label: "Transporter",
      type: "text",
      required: false,
    },
    {
      name: "v_transport_fee",
      label: "Transport Fee",
      type: "money",
      required: false,
    },
    {
      name: "v_paid_on_dispatch",
      label: "Transport Fee Paid",
      type: "money",
      required: false,
    },
    {
      name: "v_vehicle_number",
      label: "Vehicle Number",
      type: "text",
      required: true,
    },
    {
      name: "items",
      label: "Items",
      type: "dynamic",
      subFields: [
        ...((dispatchType === "transfer"
          ? [
              {
                name: "transfer_id",
                label: "Transfer Order",
                type: "select",
                required: true,
                options:
                  transferItems
                    ?.filter(
                      (transfer) =>
                        transfer.originStock.warehouse ===
                        userProfile?.warehouse
                    )
                    ?.map((transfer) => ({
                      label: `${transfer.item} To ${transfer.destinationStock.warehouse} - ${transfer.balance} remains`,
                      value: transfer.id,
                    })) || [],
              },
            ]
          : []) as FieldConfig[]),
        ...((dispatchType === "sale"
          ? [
              {
                name: "sale_item",
                label: "Item Sold",
                type: "select",
                required: true,
                options: salesItems
                  .filter((item) => item.balance && item.balance > 0)
                  .map((item) => ({
                    label: item.item_purchased,
                    value: item.id,
                  })),
              },
            ]
          : []) as FieldConfig[]),
        ...((dispatchType === "sale" && originType === "external"
          ? [
              {
                name: "purchase_item",
                label: "Origin Stock",
                type: "select",
                required: true,
                options: salesItems
                  .map((item) => item.purchase_item_info)
                  ?.filter((item) => item?.balance && item?.balance > 0)
                  ?.map((item) => ({
                    label: `${item?.item} from ${item?.purchase_info.seller} (remaining ${item?.balance})`,
                    value: item?.id,
                  })),
              },
            ]
          : []) as FieldConfig[]),
        ...((dispatchType === "purchase" && originType === "external"
          ? [
              {
                name: "purchase_item",
                label: "Origin Stock",
                type: "select",
                required: true,
                options: purchaseItems
                  ?.filter((item) => item?.balance && item?.balance > 0)
                  ?.map((item) => ({
                    label: `${item?.item} from ${item?.purchase_info.seller} (remaining ${item?.balance})`,
                    value: item?.id,
                  })),
              },
            ]
          : []) as FieldConfig[]),
        {
          name: "qty_carried",
          label: "Quantity",
          type: "number",
          required: true,
        },
      ],
    },
  ];

  const { mutate: handleSubmit, isLoading } = useMutation({
    mutationFn: async (values: any) => {
      try {
        values.items = values.items.map((i: Record<string, any>) => ({
          ...i,
          item:
            dispatchType === "sale"
              ? salesItems.find((s) => s.id === i.sale_item)?.item_purchased
              : dispatchType === "purchase"
              ? purchaseItems?.find((p) => p.id === i.purchase_item)?.item
              : dispatchType === "transfer"
              ? transferOrders?.find((t) => t.id === i.transfer_id)?.item
              : undefined,
          destination:
            dispatchType === "transfer"
              ? transferOrders?.find((t) => t.id === i.transfer_id)
                  ?.destinationStock.warehouse_info.id
              : values.v_destination,
          dispatch_type: dispatchType,
        }));
        values.v_date_dispatched =
          values.v_date_dispatched.format("YYYY-MM-DD");
        values.v_dispatched_by = userProfile?.username;
        values.v_status = dispatchType === "sale" ? "delivered" : "dispatched";
        if (originType === "internal")
          values.v_origin_warehouse = userProfile?.warehouse;
        const payload = await DispatchSchema.parseAsync(values);
        console.log(payload);
        const vehicle = await createDispatch(payload);
        setNewDispatchVehicle(vehicle);
        nextPage();
      } catch (error) {
        if (error instanceof ZodError) {
          // Handle ZodError separately to extract and display validation errors
          console.error("Zod Validation failed:", error.errors);
          throw error; // Re-throw the ZodError to be caught by the onError handler
        } else if (error instanceof Error) {
          // Handle other types of errors
          console.error("An unexpected error occurred:", error.message);
          throw new Error(error.message);
        } else {
          console.error("An unexpected error occurred:", error);
          throw new Error("An unexpected error occurred");
        }
      }
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        message.error(error.errors[0].message);
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      message.success("Dispatched successfully");
      queryClient.invalidateQueries();
    },
  });

  return {
    formConfig,
    handleSubmit,
    isLoading,
  };
}

export default useDispatchForm;
