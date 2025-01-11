import GetProfile from "@/components/profile/GetProfile";
import api from "@/services/axios";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import StatusHandler from "../error/StatusHandler";

function GetUserProfile() {
  const { userId } = useParams();
  const { isPending, isError, data, error } = useQuery<User>({
    queryKey: ["userData", userId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/user/get/${userId}`);
      return response.data.user;
    },
  });

  return (
    <div className="h-full m-5">
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!data}
        emptyMessage="User not found."
      >
        {data && <GetProfile data={data} />}
      </StatusHandler>
    </div>
  );
}

export default GetUserProfile;
