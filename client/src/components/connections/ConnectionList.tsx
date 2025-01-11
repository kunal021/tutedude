import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import { useNavigate } from "react-router-dom";
import StatusHandler from "../error/StatusHandler";

interface Connection {
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
}

function ConnectionList() {
  const navigate = useNavigate();
  const {
    data: connections,
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await api.get("/api/v1/user/all-connections");
      return response.data.connections;
    },
  });

  return (
    <StatusHandler
      isPending={isPending}
      isError={isError}
      error={error}
      isEmpty={!connections || connections.length === 0}
      emptyMessage="You have no connections."
    >
      {connections && connections.length > 0 && (
        <ul className="space-y-3 sm:space-y-4">
          {connections.map((connection: Connection, index: number) => (
            <motion.li
              key={connection._id}
              className="cursor-pointer flex items-center justify-between py-2 px-2 xs:py-3 xs:px-3 sm:py-4 sm:px-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/home/${connection._id}`)}
            >
              <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
                <motion.img
                  src={connection.profilePic}
                  alt={connection.firstName}
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
                    {connection.firstName} {connection.lastName || ""}
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {connection.profession || "Unknown Profession"}
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-400" />
              </motion.div>
            </motion.li>
          ))}
        </ul>
      )}
    </StatusHandler>
  );
}

export default ConnectionList;
