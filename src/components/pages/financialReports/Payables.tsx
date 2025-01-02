import { Card, Statistic, Table } from "antd";
import usePayables from "../../../hooks/usePayables";
import { payablesColumns } from "../../../tableColumns/payables";
import { formatNumber } from "../../../helpers/functions";

function Payables() {
  const {
    isLoading,
    payables,
    fetchNextPage,
    isFetchingNextPage,
    isRefetching,
    purchasePaymentsBalanceSum,
  } = usePayables();

  return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-6 gap-10">
      <div className="md:col-span-2">
        <Card
          title="Receivables Stats"
          bordered={true}
          style={{ width: "100%" }}
        >
          <Statistic
            title="Total Purchase Payables"
            value={
              purchasePaymentsBalanceSum
                ? formatNumber(purchasePaymentsBalanceSum)
                : "NA"
            }
            prefix={"₦"}
          />
        </Card>
      </div>
      <div className="md:col-span-4">
        <h2 className="text-3xl mb-5">Purchases</h2>
        <Table
          size="small"
          loading={isLoading || isFetchingNextPage || isRefetching}
          columns={payablesColumns}
          dataSource={payables}
          pagination={false}
          scroll={{ y: 450, x: "max-content" }}
          bordered
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (
              target.scrollHeight - target.scrollTop ===
              target.clientHeight
            ) {
              fetchNextPage();
            }
          }}
        />
      </div>
    </div>
  );
}

export default Payables;
