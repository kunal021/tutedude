import React from "react";
import { Loader2 } from "lucide-react"; // Import your loader here

type CustomError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
} | null;

interface StatusHandlerProps {
  isPending: boolean;
  isError: boolean;
  error?: CustomError;
  isEmpty: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const StatusHandler: React.FC<StatusHandlerProps> = ({
  isPending,
  isError,
  error,
  isEmpty,
  emptyMessage = "No data available.",
  children,
}) => {
  if (isPending) {
    return (
      <div className="h-fit flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-lime-500" />
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "An error occurred.";

    return (
      <div className="h-fit flex justify-center items-center">
        <p className="text-red-500 text-xl">{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="h-fit flex justify-center items-center">
        <p className="text-yellow-500 text-xl">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default StatusHandler;
