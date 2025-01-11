import GetProfile from "@/components/profile/GetProfile";
import StatusHandler from "@/components/error/StatusHandler";
import api from "@/services/axios";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

function ProfilePage() {
  const { isPending, isError, data, error } = useQuery<User>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/profile");
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

export default ProfilePage;
