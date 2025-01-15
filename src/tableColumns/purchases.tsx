import { ColumnsType } from "antd/es/table";
import { PurchasesAndPayments } from "../types/db";
import TableActions from "../components/pages/purchases/TableActions";
import { formatNumber } from "../helpers/functions";

export const purchasesAdminColumns: ColumnsType<PurchasesAndPayments> = [
  {
    title: "S.N",
    render: (_, __, index) => index + 1, // Calculate row number
    width: 40,
    fixed: "left",
    align: "center",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Order Number",
    dataIndex: "order_number",
    key: "order_number",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Item",
    dataIndex: "item",
    key: "item",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    render: (_, record) => (
      <span className="">
        {`${formatNumber(record.quantity)}`} {record.item_info.unit}
      </span>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text) => <span className="">{`₦${formatNumber(text)}`}</span>,
  },
  {
    title: "Amount Paid",
    dataIndex: "paid",
    key: "paid",
    render: (text) => <span className="">{`₦${formatNumber(text)}`}</span>,
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (text) => <span className="">{`₦${formatNumber(text)}`}</span>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => <TableActions purchase={record} />,
  },
];
