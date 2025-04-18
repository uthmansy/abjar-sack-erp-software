import { Space } from "antd";
import { EmployeePayrollAndEmployee } from "../../../types/db";
import Edit from "./Edit";
import useAuthStore from "../../../store/auth";
import ViewEmployeePayroll from "./ViewEmployeePayroll";

interface Props {
  employeePayroll: EmployeePayrollAndEmployee;
}

function EmployeePayrollTableActions({ employeePayroll }: Props) {
  const { userProfile } = useAuthStore();
  return (
    <Space size="small">
      {userProfile?.role === "ACCOUNTING" ||
        userProfile?.role === "SUPER ADMIN" ||
        userProfile?.role === "ADMIN"}
      <Edit employeePayroll={employeePayroll} />
      <ViewEmployeePayroll payrollId={employeePayroll.id} />
    </Space>
  );
}

export default EmployeePayrollTableActions;
