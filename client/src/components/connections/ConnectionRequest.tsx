import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/services/axios";
import StatusHandler from "../error/StatusHandler";
import { useToast } from "@/hooks/useToast";

interface ConnectionRequest {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName?: string;
    age?: number;
    gender?: string;
    bio: string;
    profilePic: string;
    coverPic: string;
    skills?: string[];
    profession?: string;
  };
  receiver: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// interface ConnectionRequestsProps {
//   requests: ConnectionRequest[];
// }

function ConnectionRequest() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: requests,
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/all-connection-requests");
      return response.data.connectionRequests;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      action,
      connectionId,
    }: {
      action: "accepted" | "rejected";
      connectionId: string;
    }) => {
      return await api.post(
        `/api/v1/connection/review/${action}/${connectionId}`
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.setQueryData(["requests"], (oldData: ConnectionRequest[]) => {
        if (!oldData) {
          return oldData;
        }
        return oldData.filter(
          (request: ConnectionRequest) => request._id !== variables.connectionId
        );
      });
      const successMessage =
        variables.action === "accepted"
          ? "You have accepted the connection request."
          : "You have rejected the connection request.";

      showToast("success", successMessage, "bottom-right", 2000);
      console.log("Success");
    },
    onError: (error) => {
      showToast("error", "Error accepting Connection", "bottom-right", 2000);
      console.log("Error", error);
    },
  });

  const { mutate, isPending: isRequestReviewPending } = mutation;

  const handleAction = (
    action: "accepted" | "rejected",
    connectionId: string
  ) => {
    mutate({ action, connectionId });
  };

  return (
    <StatusHandler
      isPending={isPending}
      isError={isError}
      error={error}
      isEmpty={!requests || requests.length === 0}
      emptyMessage="You have no requests."
    >
      {requests && requests.length > 0 && (
        <ul className="space-y-3 sm:space-y-4">
          {requests.map((request: ConnectionRequest, index: number) => (
            <motion.li
              key={request._id}
              className="cursor-pointer flex items-center justify-between py-2 px-2 xs:py-3 xs:px-3 sm:py-4 sm:px-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                onClick={() => navigate(`/home/${request.sender._id}`)}
                className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4"
              >
                <motion.img
                  src={request.sender.profilePic}
                  alt={request.sender.firstName}
                  className="w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}
                />
                <div>
                  <h3 className="text-sm xs:text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {request.sender.firstName} {request.sender.lastName || ""}
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {request.sender.profession}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1 xs:space-x-2">
                <motion.button
                  disabled={isRequestReviewPending}
                  className="p-1 xs:p-1.5 sm:p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  onClick={() => handleAction("accepted", request._id)}
                  aria-label="Accept connection request"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isRequestReviewPending ? (
                    <Loader2 className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6" />
                  )}
                </motion.button>
                <motion.button
                  disabled={isRequestReviewPending}
                  className="p-1 xs:p-1.5 sm:p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleAction("rejected", request._id)}
                  aria-label="Reject connection request"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isRequestReviewPending ? (
                    <Loader2 className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <X className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6" />
                  )}
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </StatusHandler>
  );
}

export default ConnectionRequest;
