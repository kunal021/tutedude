import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import UserCardStack from "@/components/user/UserCardStack";
import StatusHandler from "@/components/error/StatusHandler";

export default function RecommendationPage() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userRecommendations"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/connection/recommendations`);

      return response.data.recommendations;
    },
  });

  return (
    <div className="container mx-auto py-4">
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!data || data?.length === 0}
        emptyMessage="No feed data available."
      >
        {data && <UserCardStack data={data} />}
      </StatusHandler>
    </div>
  );
}
