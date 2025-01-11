import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import ChangePassword from "@/components/profile/ChangePassword";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "./ImageUpload";
import EditUsername from "./EditUsername";
import DeleteProfile from "./DeleteProfile";

function GetProfile({ data }: { data: User }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Profile
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
            {data?.profilePic && (
              <div className="flex-shrink-0 relative">
                <motion.img
                  src={data?.profilePic}
                  alt={`${data.firstName} ${data.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-lime-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {user?._id === data._id && (
                  <span className="cursor-pointer absolute flex items-center justify-center right-0 bottom-0 rounded-full border-2 bg-lime-400 h-8 w-8">
                    <ImageUpload type="profilePic" />
                  </span>
                )}
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <h2 className="flex items-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                {data.firstName} {data.lastName}{" "}
                {user?._id === data._id && <DeleteProfile />}
              </h2>
              <p className="flex items-center text-lime-500 dark:text-lime-400">
                @{data.userName}
                {user?._id === data._id && <EditUsername />}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {data.bio}
              </p>
            </div>
          </div>

          {user?._id === data._id && (
            <div className="flex max-sm:flex-col justify-between items-center gap-4 mt-8 w-full">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <Button
                  onClick={() => {
                    navigate("/profile/edit", { state: { userId: data?._id } });
                  }}
                  variant="secondary"
                  className="text-base py-2 px-8 bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out"
                >
                  Edit Profile
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <ChangePassword />
              </motion.div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {user?._id === data._id && (
              <InfoCard title="Email" value={data.email} />
            )}
            <InfoCard
              title="Member Since"
              value={new Date(data.createdAt).toLocaleDateString()}
            />
            {user?._id === data._id && (
              <InfoCard
                title="Last Updated"
                value={new Date(data.updatedAt).toLocaleDateString()}
              />
            )}
            <InfoCard title="Age" value={data.age || "Age Not Provided"} />
            <InfoCard
              title="Location"
              value={data.location || "Location Not Provided"}
            />
            <InfoCard
              title="Skills"
              value={data.intrests!.join(", ") || "No skills listed"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
    >
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </motion.div>
  );
}

export default GetProfile;
