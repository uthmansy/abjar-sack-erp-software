import { Breadcrumb, Button } from "antd";
import { vehiclesKeys } from "../../../constants/QUERY_KEYS";
import RefreshButton from "../../RefreshButton";
import AllReceivedVehicles from "./AllReceivedVehicles";
import { BorderInnerOutlined, HomeOutlined } from "@ant-design/icons";
import { VehiclesAndDestination } from "../../../types/db";
import { getVehicles } from "../../../helpers/apiFunctions";
import useCsv from "../../../hooks/useCsv";
import { Headers } from "react-csv/lib/core";
import { flattenObject } from "../../../helpers/functions";
import { CSVLink } from "react-csv";

function ReceivedVehicles() {
  const headers: Headers = [
    { label: "Waybill Number", key: "waybill_number" },
    { label: "Vehicle Number", key: "vehicle_number" },
    { label: "Item", key: "item" },
    { label: "Quantity Carried", key: "qty_carried" },
    { label: "Quantity Received", key: "qty_received" },
    { label: "Dispatched By", key: "dispatched_by" },
    { label: "Received By", key: "received_by" },
    { label: "Driver Name", key: "driver_name" },
    { label: "Driver Number", key: "driver_number" },
    { label: "Origin State", key: "origin_state" },
    { label: "Transporter", key: "transporter" },
    { label: "Date Dispatched", key: "date_dispatched" },
    { label: "Date Received", key: "date_received" },
    { label: "Item Code", key: "item_info_code" },
    { label: "Item Unit", key: "item_info_unit" },
    { label: "Purchase Cost", key: "item_info_purchase_cost" },
    { label: "Destination Warehouse", key: "destination_stock_warehouse" },
    {
      label: "Warehouse Address",
      key: "destination_stock_warehouse_info_address",
    },
    {
      label: "Stock Purchases Seller",
      key: "external_origin_stock_stock_purchases_seller",
    },
    {
      label: "Stock Purchases Quantity",
      key: "external_origin_stock_stock_purchases_quantity",
    },
  ];
  const { data } = useCsv<VehiclesAndDestination[]>({
    queryFn: () => getVehicles("received", {}),
    queryKey: vehiclesKeys.getReceivedCsv,
  });

  const flatData = data?.map((item) => flattenObject(item));

  return (
    <>
      <Breadcrumb
        className="mb-5"
        items={[
          {
            href: "",
            title: <HomeOutlined />,
          },
          {
            href: "",
            title: (
              <>
                <span className="uppercase">Received Vehicles</span>
              </>
            ),
          },
        ]}
      />
      <div className="mb-5 flex space-x-3">
        <RefreshButton queryKey={vehiclesKeys.getReceivedVehicles} />
        {flatData && (
          <Button icon={<BorderInnerOutlined />}>
            <CSVLink
              filename={"received-trucks.csv"}
              data={flatData}
              headers={headers}
            >
              Export to CSV
            </CSVLink>
          </Button>
        )}
      </div>

      <AllReceivedVehicles />
    </>
  );
}

export default ReceivedVehicles;
