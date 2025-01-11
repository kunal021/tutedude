import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import UserCardStack from "@/components/user/UserCardStack";
import StatusHandler from "@/components/error/StatusHandler";
import { useState } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setPage(1);
    setSearchValue(search);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userFeed", page, limit, searchValue],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/user/feed?page=${page}&limit=${limit}&search=${searchValue}`
      );

      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    },
  });

  return (
    <div className="container mx-auto py-4">
      <StatusHandler
        isPending={isPending}
        isError={isError}
        error={error}
        isEmpty={!data || data?.data?.length === 0}
        emptyMessage="No feed data available."
      >
        {data && (
          <UserCardStack
            data={data.data}
            pagination={data.pagination}
            handleSearch={handleSearch}
            search={search}
            setSearch={setSearch}
            handlePageChange={handlePageChange}
          />
        )}
      </StatusHandler>
    </div>
  );
}
