import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, UpdateUser, User, UserUpdateError } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import { Loader2 } from "lucide-react";
import ErrorDisplay from "../error/ErrorDisplay";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/useToast";

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const requiredFields = ["firstName", "userName"];

const EditProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const { userId } = location.state;

  const {
    isPending: isGetUserPending,
    isError: isGetUserError,
    data: getUserData,
    error: getUserError,
  } = useQuery<User>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get(`/api/v1/user/get/${userId}`);
      return response.data.user;
    },
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateUser>({
    firstName: "",
    lastName: "",
    userName: "",
    age: undefined,
    bio: "",
    profession: "",
    intrests: [],
    location: "",
    gender: "",
  });

  useEffect(() => {
    if (getUserData) {
      setFormData({
        firstName: getUserData.firstName,
        lastName: getUserData?.lastName || "",
        userName: getUserData.userName,
        age: getUserData?.age || undefined,
        bio: getUserData.bio,
        intrests: getUserData?.intrests || [],
        location: getUserData.location || "",
        gender: getUserData?.gender || "",
      });
    }
  }, [getUserData]);

  const handleAddSkills = (
    e: React.KeyboardEvent<HTMLInputElement>
    // value: string;
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skillInput = e.target as HTMLInputElement;
      const skillValue = skillInput.value.trim();

      if (skillValue) {
        if (skillValue.length > 50) {
          showToast("error", "Interest is too long", "bottom-right", 2000);
        }
      }

      if (skillValue && !formData.intrests.includes(skillValue)) {
        setFormData((prevData) => ({
          ...prevData,
          intrests: [...prevData.intrests, skillValue],
        }));
        skillInput.value = "";
      } else {
        showToast("error", "Interest already exists", "bottom-right", 2000);
      }
    }
  };

  const handleRemoveSkill = (intrest: string) => {
    setFormData((prevData) => ({
      ...prevData,
      intrests: prevData.intrests.filter((s) => s !== intrest),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data: UpdateUser) => {
      return api.patch(`/api/v1/user/update`, data);
    },
    onSuccess: (data) => {
      setUser(data.data.updatedUser);
      Cookies.set("user", JSON.stringify(data.data.updatedUser), {
        expires: 15,
      });
      navigate("/profile");
      console.log("Success Updating User");
    },
    onError: (error: ApiError<UserUpdateError>) => {
      console.error("Error Updating User:", error);
    },
  });

  const {
    mutate,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
    isSuccess: isUpdateSuccess,
  } = mutation;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) => !requiredFields.includes(field)
    );

    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
    }

    mutate({ ...formData, age: Number(formData.age) });
  };

  if (isGetUserPending) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (isGetUserError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading User Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {(getUserError as Error).message}
          </p>
          <Button onClick={() => navigate("/profile")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center"
        >
          Edit Profile
        </motion.h2>
        <div className="flex justify-center items-center mb-6">
          <ErrorDisplay isError={isUpdateError} error={updateError} />

          {isUpdateSuccess && (
            <p style={{ color: "green" }}>Profile updated successful!</p>
          )}
        </div>
        <motion.form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
        >
          {[
            { id: "firstName", label: "First Name", type: "text" },
            { id: "lastName", label: "Last Name", type: "text" },
            { id: "userName", label: "Username", type: "text" },
            { id: "age", label: "Age", type: "number" },
            { id: "location", label: "Location", type: "text" },
          ].map((field) => (
            <motion.div
              key={field.id}
              variants={itemVariants}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <Label
                htmlFor={field.id}
                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
              >
                {field.label}
                {requiredFields.includes(field.id) && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <motion.div
                variants={inputVariants}
                animate={focusedField === field.id ? "focus" : ""}
                className="relative"
              >
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.label}
                  className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                  onFocus={() => setFocusedField(field.id)}
                  onBlur={() => setFocusedField(null)}
                  value={formData[field.id as keyof UpdateUser] || ""}
                  onChange={handleChange}
                />
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <Label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
            >
              Gender
            </Label>
            <Select
              name="gender"
              value={formData.gender}
              defaultValue={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: value,
                }))
              }
            >
              <SelectTrigger className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:ring-offset-0 focus:outline-none p-0 focus:shadow-none">
                <SelectValue placeholder="Select a gender" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-none text-gray-800 dark:text-white rounded-xl">
                <SelectGroup>
                  <SelectLabel className="border-none">Gender</SelectLabel>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    Prefer not to say
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-2 relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <Label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
            >
              Bio
            </Label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === "bio" ? "focus" : ""}
              className="relative"
            >
              <Textarea
                id="bio"
                placeholder="Write a short bio..."
                className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 min-h-[100px] resize-none focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                onFocus={() => setFocusedField("bio")}
                onBlur={() => setFocusedField(null)}
                value={formData.bio}
                onChange={handleChange}
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:col-span-2 relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <Label
              htmlFor="intrests"
              className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
            >
              Intrests
            </Label>
            <motion.div
              variants={inputVariants}
              animate={focusedField === "intrests" ? "focus" : ""}
              className="relative"
            >
              <Input
                id="intrests"
                onKeyDown={(e) => handleAddSkills(e)}
                placeholder="Intrests (Click Enter to add)"
                className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                onFocus={() => setFocusedField("intrests")}
                onBlur={() => setFocusedField(null)}
              />
            </motion.div>

            {formData.intrests.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                {formData.intrests.map((intrest, index) => (
                  <div
                    key={intrest + index}
                    className="flex justify-between items-center gap-2 p-2 bg-gray-200 dark:bg-gray-950 rounded"
                  >
                    <p className="text-gray-800 dark:text-white font-semibold ">
                      {intrest}
                    </p>
                    <p
                      onClick={() => handleRemoveSkill(intrest)}
                      className="text-red-500 cursor-pointer"
                    >
                      X
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="flex justify-between items-center w-full gap-5">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                duration: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="w-full"
            >
              <Button
                disabled={isUpdatePending}
                type="submit"
                variant="secondary"
                className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out w-full"
              >
                {isUpdatePending ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="#84cc16"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
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
              className="w-full"
            >
              <Button
                disabled={isUpdatePending}
                onClick={() => navigate("/profile")}
                className="bg-red-50 hover:bg-red-100 border-2 border-red-500 text-black transition-all duration-200 ease-in-out w-full"
              >
                Close
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
