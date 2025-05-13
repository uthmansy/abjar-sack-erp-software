import { Button, Table } from "antd";
import useAllSalesPayments from "../../../hooks/useAllSalesPayments";
import { salesPaymentsAdminColumns } from "../../../tableColumns/salesPayments";
import useAllPurchasePayments from "../../../hooks/useAllPurchasePayments";
import { purchasesPaymentsAdminColumns } from "../../../tableColumns/purchasePayments";
import useCsv from "../../../hooks/useCsv";
import { SalesPaymentsJoined } from "../../../types/db";
import { getSalesPaymentsCsv } from "../../../helpers/apiFunctions";
import { salesPaymentsKeys } from "../../../constants/QUERY_KEYS";
import { Headers } from "react-csv/lib/core";
import { CSVLink } from "react-csv";
import { BorderInnerOutlined } from "@ant-design/icons";

function Transactions() {
  const {
    isLoading,
    salesPayments,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useAllSalesPayments();
  const {
    isLoading: isLoadingP,
    purchasePayments,
    fetchNextPage: fetchNextPageP,
    isFetchingNextPage: isFetchingNextPageP,
    isRefetching: isRefetchingP,
  } = useAllPurchasePayments();

  const salesPaymentsHeader: Headers = [
    { label: "Date", key: "date" },
    { label: "Order Number", key: "order_number" },
    { label: "Customer", key: "sale.customer_name" },
    { label: "Amount", key: "amount" },
    { label: "Account Number", key: "account_number" },
    { label: "Account Name", key: "account_name" },
    { label: "Bank Name", key: "bank_name" },
    { label: "Payment Ref", key: "payement_ref" },
    { label: "Payment Mode", key: "payment_mode" },
  ];

  const { data: salesPaymentsCsv } = useCsv<SalesPaymentsJoined[]>({
    queryFn: getSalesPaymentsCsv,
    queryKey: salesPaymentsKeys.getCsv,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
      <div>
        <h2 className="text-3xl mb-5">Inflow</h2>
        {salesPaymentsCsv && (
          <Button className="mb-5" icon={<BorderInnerOutlined />}>
            <CSVLink
              filename={"Sales.csv"}
              data={salesPaymentsCsv}
              headers={salesPaymentsHeader}
            >
              Export to CSV
            </CSVLink>
          </Button>
        )}
        <Table
          size="small"
          loading={isLoading || isFetchingNextPage || isRefetching}
          columns={salesPaymentsAdminColumns} // Updated columns reference
          dataSource={salesPayments} // Updated data source
          pagination={false} // Disable pagination
          scroll={{ y: 450, x: "max-content" }}
          bordered
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (
              Math.round(target.scrollHeight - target.scrollTop) ===
              target.clientHeight
            ) {
              fetchNextPage();
            }
          }}
        />
      </div>
      <div>
        <h2 className="text-3xl mb-5">Outflow</h2>
        <Table
          size="small"
          loading={isLoadingP || isFetchingNextPageP || isRefetchingP}
          columns={purchasesPaymentsAdminColumns} // Updated columns reference
          dataSource={purchasePayments} // Updated data source
          pagination={false} // Disable pagination
          scroll={{ y: 450, x: "max-content" }}
          bordered
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (
              Math.round(target.scrollHeight - target.scrollTop) ===
              target.clientHeight
            ) {
              fetchNextPageP();
            }
          }}
        />
      </div>
    </div>
  );
}

export default Transactions;
