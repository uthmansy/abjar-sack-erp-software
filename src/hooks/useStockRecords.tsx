import { useQuery, useQueryClient } from "react-query";
import {
  inventoryItemsKeys,
  stocksKeys,
  warehousesKeys,
} from "../constants/QUERY_KEYS";
import { App, DescriptionsProps } from "antd";
import {
  getItemRecord,
  getItemsNames,
  getWarehousesNames,
} from "../helpers/apiFunctions";
import { useEffect, useState } from "react";
import { StocksWithDetails } from "../types/db";
import { formatNumber } from "../helpers/functions";
import useAuthStore from "../store/auth";

interface HookReturn {
  warehouses: string[];
  items: string[];
  tableItems: DescriptionsProps["items"];
  handleWarehouse: (warehouse: string) => void;
  handleItem: (item: string) => void;
  record: StocksWithDetails | undefined;
  isLoading: boolean;
  handleItemSearch: (value: any) => void;
  resetFilters: (value: any) => void;
}

function useStockRecords(): HookReturn {
  const { message } = App.useApp();
  const [warehouse, setWarehouse] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [searchByName, setSearchByName] = useState<string | null>();
  const queryClient = useQueryClient();

  const handleWarehouse = (warehouse: string) => setWarehouse(warehouse);
  const handleItem = (item: string) => setItem(item);

  const handleItemSearch = (value: any) => {
    setSearchByName(value.target.value);
  };

  const resetFilters = () => {
    setSearchByName(null);
    queryClient.invalidateQueries(inventoryItemsKeys.getItemsNames);
  };

  const { data: warehouses } = useQuery({
    queryKey: warehousesKeys.getWarehousesNames,
    queryFn: async (): Promise<string[]> => {
      const warehouses = await getWarehousesNames();
      return warehouses.map((warehouse) => warehouse.name);
    },
    onError: () => {
      message.error("Failed to Load Warehouses Names");
    },
  });

  const { data: items } = useQuery({
    queryKey: [inventoryItemsKeys.getItemsNames, searchByName],
    queryFn: async (): Promise<string[]> => {
      const items = await getItemsNames(searchByName);
      return items.map((item) => item.name);
    },
    onError: () => {
      message.error("Failed to Load Items Names");
    },
  });

  const { userProfile } = useAuthStore();

  useEffect(() => {
    if (warehouses && warehouses.length > 0 && items && items.length > 0) {
      handleWarehouse(userProfile?.warehouse || warehouses[0]);
      handleItem(items[0]);
    }
  }, [warehouses, items, userProfile]);

  const {
    data: record,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [stocksKeys.getItemRecord, warehouse, item],
    queryFn: async (): Promise<StocksWithDetails> => {
      const record = await getItemRecord(warehouse, item);
      return record;
    },
    onError: () => {
      message.error("Failed to Load Item");
    },
  });

  const tableItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: <span className="font-bold uppercase">Balance in Store</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.balance || 0)} {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.balance || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "2",
      label: <span className="font-bold uppercase">Dispatched</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.dispatched || 0)} {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.dispatched || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "3",
      label: <span className="font-bold uppercase">Received</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.received || 0)} {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.received || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "4",
      label: <span className="font-bold uppercase">Utilized</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.utilized || 0)} {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.utilized || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "5",
      label: <span className="font-bold uppercase">Produced</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.produced || 0)} {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.produced || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "5",
      label: <span className="font-bold uppercase">Production Balance</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.production_balance || 0)}{" "}
            {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.production_balance || 0))} MTS
          </span> */}
        </div>
      ),
    },
    {
      key: "7",
      label: <span className="font-bold uppercase">Production Inflow</span>,
      children: (
        <div className="flex">
          <span className="w-1/2">
            {formatNumber(record?.production_inflow || 0)}{" "}
            {record?.item_info.unit}
          </span>
          {/* <span className="w-1/2">
            {formatNumber(bagsToTons(record?.production_inflow || 0))} MTS
          </span> */}
        </div>
      ),
    },
  ];

  return {
    items: items || [],
    warehouses: warehouses || [],
    tableItems,
    handleItem,
    handleWarehouse,
    isLoading: isLoading || isRefetching,
    record,
    handleItemSearch,
    resetFilters,
  };
}

export default useStockRecords;
