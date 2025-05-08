import { ColumnsType } from "antd/es/table";
import { formatNumber } from "../helpers/functions";
import { Tag } from "antd";
import { FinancialReportLedger } from "../types/db";
import { MONTHS } from "../constants/ENUMS";

export const financialReportsColumns: ColumnsType<FinancialReportLedger> = [
  {
    title: "Month",
    dataIndex: "month",
    key: "month",
    render: (_, record) => (
      <span className="capitalize">
        {record.month && MONTHS[record.month - 1]}
      </span>
    ),
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    render: (_, record) => record.year,
  },
  {
    title: "Revenue",
    dataIndex: "total_revenue",
    key: "total_revenue",
    render: (_, record) => `₦${formatNumber(record.total_revenue || 0)}`,
  },
  {
    title: "Cost of used goods sold/used",
    dataIndex: "total_cost_of_used",
    key: "total_cost_of_used",
    render: (_, record) => `₦${formatNumber(record.total_cost_of_used || 0)}`,
  },
  {
    title: "Expenses",
    dataIndex: "total_expenses",
    key: "total_expenses",
    render: (_, record) => `₦${formatNumber(record.total_expenses || 0)}`,
  },
  {
    title: "Payroll",
    dataIndex: "total_payroll",
    key: "total_payroll",
    render: (_, record) => `₦${formatNumber(record.total_payroll || 0)}`,
  },
  {
    title: "Vehicle Transport Fees",
    dataIndex: "transport_fees",
    key: "transport_fees",
    render: (_, record) => `₦${formatNumber(record.transport_fees || 0)}`,
  },
  {
    title: "Profit/Loss",
    dataIndex: "profit",
    key: "profit",
    render: (_, record) =>
      record.profit && (
        <Tag
          color={record.profit > 0 ? "green" : "red"}
          className="capitalize"
        >{`₦${formatNumber(record.profit)}`}</Tag>
      ),
  },
];
