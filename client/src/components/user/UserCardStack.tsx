import api from "@/services/axios";
import UserCard from "./UserCard";
import { User } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import { Pagination } from "../extra/Pagination";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";

interface Props {
  data: User[];
  pagination?: { page: number; limit: number; total: number };
  handleSearch?: () => void;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  handlePageChange?: (newPage: number) => void;
}

export default function UserCardStack({
  data,
  pagination,
  handleSearch,
  search,
  setSearch,
  handlePageChange,
}: Props) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      action,
      userId,
    }: {
      action: "interested" | "ignored";
      userId: string;
    }) => {
      return await api.post(`/api/v1/connection/send/${action}/${userId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userFeed"] });
      queryClient.setQueryData(["userFeed"], (oldData: User[]) => {
        if (!oldData) {
          return oldData;
        }
        return oldData.filter((user: User) => user._id !== variables.userId);
      });
      const successMessage =
        variables.action === "interested"
          ? "You have expressed interest in the connection."
          : "You have ignored the connection.";

      showToast("success", successMessage, "bottom-right", 2000);
      console.log("Success");
    },
    onError: (error) => {
      showToast("error", "Error Sending Connection", "bottom-right", 2000);
      console.log("Error", error);
    },
  });

  const { mutate, isPending } = mutation;

  const handleAction = ({
    action,
    userId,
  }: {
    action: "interested" | "ignored";
    userId: string;
  }) => {
    mutate({ action, userId });
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden">
      <motion.div className="space-y-6" layout>
        <AnimatePresence>
          {setSearch && handleSearch && (
            <div className="flex items-center gap-4 max-w-2xl mx-auto mt-2">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users using first name, last name or username"
              />
              <Button
                onClick={handleSearch}
                variant={"secondary"}
                className="bg-lime-50 hover:bg-lime-100 text-black"
              >
                Search
              </Button>
            </div>
          )}
          {data &&
            data?.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{
                  opacity: { duration: 0.3 },
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                }}
              >
                <UserCard
                  user={user}
                  onConnect={() =>
                    handleAction({ action: "interested", userId: user._id! })
                  }
                  onIgnore={() =>
                    handleAction({ action: "ignored", userId: user._id! })
                  }
                  isLoading={isPending}
                />
              </motion.div>
            ))}
          {pagination && handlePageChange && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={handlePageChange}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
