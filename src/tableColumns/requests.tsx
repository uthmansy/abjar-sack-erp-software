import { ColumnsType } from "antd/es/table";
import { RequestWithItems } from "../types/db";
import { Tag } from "antd";
import RequestsTableActions from "../components/pages/requests/RequestsTableActions";
import { formatNumber } from "../helpers/functions";
// import TransitTableActions from "../components/pages/transit/TransitTableActions";

export const requestsAdminColumns: ColumnsType<RequestWithItems> = [
  {
    title: "S.N",
    render: (_, __, index) => index + 1, // Calculate row number
    width: 40,
  },
  {
    title: "Date Requested",
    dataIndex: "date_requested",
    key: "date_requested",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Date Used",
    dataIndex: "date_used",
    key: "date_used",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Shift",
    dataIndex: "shift",
    key: "shift",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text, record) => (
      <Tag
        color={`${
          record.status === "pending"
            ? "blue"
            : record.status === "accepted"
            ? "green"
            : "red"
        }`}
      >
        {text}
      </Tag>
    ),
  },
  {
    title: "Requested By",
    dataIndex: "requested_by",
    key: "requested_by",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Accepted By",
    dataIndex: "accepted_by",
    key: "accepted_by",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Rejected By",
    dataIndex: "rejected_by",
    key: "rejected_by",
    render: (text) => <span className="capitalize">{text}</span>,
  },
  {
    title: "Items",
    key: "items",
    render: (_, record) => (
      <div>
        {record.request_items.map((item) => (
          <div className="flex space-x-3">
            <span>{item.item}:</span>
            <span>{item.quantity}</span>
            <span>
              {item.item_info.purchase_cost
                ? `₦${formatNumber(
                    item.quantity * item.item_info?.purchase_cost
                  )}`
                : "NA"}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => <RequestsTableActions request={record} />,
  },
];
