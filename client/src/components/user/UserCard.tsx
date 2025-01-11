import { User } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: Partial<User>;
  onConnect: () => void;
  onIgnore: () => void;
  isLoading?: boolean;
}

function UserCard({ user, onConnect, onIgnore, isLoading }: UserCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      <div
        className="h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: "./placeholder.jpg",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          onClick={() => navigate(`/home/${user?._id}`)}
          className="absolute bottom-4 left-4 flex items-end cursor-pointer"
        >
          <img
            className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 mr-3"
            src={user?.profilePic}
            alt={`${user?.firstName || "Unknown"} ${user?.lastName || "User"}`}
          />
          <div className="text-white">
            <h2 className="text-2xl font-bold">
              {user?.firstName || "Unknown"} {user?.lastName || "User"}
            </h2>
            <p className="text-sm">
              {user?.location || "Location not available"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {user?.bio || "Bio not available"}
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            disabled={isLoading}
            variant="outline"
            size="icon"
            className="rounded-full h-14 w-14 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onIgnore}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6 text-red-500 dark:text-red-400" />
            ) : (
              <X className="h-6 w-6 text-red-500 dark:text-red-400" />
            )}
            <span className="sr-only">
              {isLoading ? "Ignoring..." : "Ignore"}
            </span>
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            size="icon"
            className="rounded-full h-14 w-14 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onConnect}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-6 w-6 text-green-500 dark:text-green-400" />
            ) : (
              <Check className="h-6 w-6 text-green-500 dark:text-green-400" />
            )}
            <span className="sr-only">
              {isLoading ? "Connecting..." : "Connect"}
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default UserCard;
