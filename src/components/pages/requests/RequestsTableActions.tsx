import { Space } from "antd";
import { RequestWithItems } from "../../../types/db";
import ApproveRequest from "./ApproveRequest";
import RejectRequest from "./RejectRequest";
import DeleteRequest from "./DeleteRequest";
import useAuthStore from "../../../store/auth";
import MarkUsed from "./MarkUsed";
import EditRequest from "./EditRequest";

interface Props {
  request: RequestWithItems;
}

function RequestsTableActions({ request }: Props) {
  const { userProfile } = useAuthStore();
  return (
    <Space size="small">
      {request.status === "pending" && (
        <>
          {(userProfile?.role === "SUPER ADMIN" ||
            userProfile?.role === "INVENTORY") && (
            <>
              <ApproveRequest request={request} />
              <RejectRequest request={request} />
            </>
          )}
          {(userProfile?.role === "SUPER ADMIN" ||
            userProfile?.role === "PRODUCTION") && (
            <>
              <DeleteRequest request={request} />
              <EditRequest request={request} />
            </>
          )}
        </>
      )}
      {((request.status === "accepted" &&
        !request.used &&
        userProfile?.role === "SUPER ADMIN") ||
        userProfile?.role === "PRODUCTION") && (
        <>
          <MarkUsed request={request} />
        </>
      )}
      {(userProfile?.role === "SUPER ADMIN" ||
        userProfile?.role === "INVENTORY") &&
        request.used && (
          <>
            <EditRequest request={request} />
          </>
        )}
    </Space>
  );
}

export default RequestsTableActions;
