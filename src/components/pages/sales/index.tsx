import { BorderInnerOutlined, HomeOutlined } from "@ant-design/icons";
import { salesKeys } from "../../../constants/QUERY_KEYS";
import useAuthStore from "../../../store/auth";
import RefreshButton from "../../RefreshButton";
import AddNew from "./AddNew";
import AllSales from "./AllSales";
import { Breadcrumb, Button } from "antd";
import useSalesCsv from "../../../hooks/useSalesCsv";
import { CSVLink } from "react-csv";

function Sales() {
  const { userProfile } = useAuthStore();
  const { data, headers } = useSalesCsv();
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
                <span className="uppercase">Sales</span>
              </>
            ),
          },
        ]}
      />
      <div className="mb-5 flex space-x-3">
        <RefreshButton queryKey={salesKeys.getAllSales} />
        {(userProfile?.role === "SUPER ADMIN" ||
          userProfile?.role === "ADMIN" ||
          userProfile?.role === "ACCOUNTING") && <AddNew />}
        {data && (
          <Button icon={<BorderInnerOutlined />}>
            <CSVLink filename={"Sales.csv"} data={data} headers={headers}>
              Export to CSV
            </CSVLink>
          </Button>
        )}
      </div>
      <AllSales />
    </>
  );
}

export default Sales;
