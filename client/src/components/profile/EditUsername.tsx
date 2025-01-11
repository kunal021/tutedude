import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { ApiError, PasswordUpdateError, SignupError } from "@/types";
import { Loader2, Pencil, UserSearch } from "lucide-react";
import ErrorDisplay from "../error/ErrorDisplay";
import { useToast } from "@/hooks/useToast";

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

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

function EditUsername() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { userName: string }) => {
      return await api.patch("/api/v1/user/username-change", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      setIsOpen(false);
      console.log("Success Updating Password");
    },
    onError: (error: ApiError<PasswordUpdateError>) => {
      console.error("Error Updating Password:", error);
    },
  });

  const { mutate, isSuccess, error, isError, isPending } = mutation;

  const userNameMutation = useMutation({
    mutationFn: (userName: string) => {
      return api.post(`/api/v1/auth/username-exists`, {
        userName,
      });
    },
    onSuccess: () => {
      console.log("Success checking username");
      showToast("success", "Username available", "bottom-right", 2000);
    },
    onError: (error: ApiError<SignupError>) => {
      console.error("Error checking username:", error);
      showToast("error", "Username already exists", "bottom-right", 2000);
    },
  });

  const {
    mutate: checkUserName,
    isPending: userNameLoading,
    isSuccess: isUserNameSuccess,
    error: userNameError,
    isError: isUserNameError,
  } = userNameMutation;

  const handleUserNameChange = () => {
    if (!userName) {
      alert("Please fill in all fields.");
      return;
    }
    checkUserName(userName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) {
      alert("Please fill in all fields.");
      return;
    }
    mutate({ userName });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Pencil className="cursor-pointer ml-2 h-4 w-4" />
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[425px]" forceMount>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Change Username</DialogTitle>
                <DialogDescription>
                  Enter a username to change current username.
                </DialogDescription>
              </DialogHeader>
              <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4 mt-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <Label
                    htmlFor={"userNmae"}
                    className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                  >
                    New UserName
                  </Label>
                  <motion.div variants={inputVariants} className="relative">
                    <Input
                      id={"userName"}
                      type={"text"}
                      placeholder={"Enter New Username"}
                      className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={userNameLoading}
                      onClick={handleUserNameChange}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-black hover:text-black dark:text-white dark:hover:text-white"
                    >
                      {userNameLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <UserSearch className="h-6 w-6" />
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                <div className="flex justify-center items-center">
                  {isError && <ErrorDisplay error={error} isError={isError} />}
                  {isSuccess && (
                    <p style={{ color: "green" }}>
                      Username change successful!
                    </p>
                  )}
                </div>

                <div className="flex justify-center items-center">
                  <ErrorDisplay
                    isError={isUserNameError}
                    error={userNameError}
                  />
                  {isUserNameSuccess && (
                    <p style={{ color: "green" }}>Username Available</p>
                  )}
                </div>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        fill="#84cc16"
                      />
                      Changing...
                    </>
                  ) : (
                    "Change Username"
                  )}
                </Button>
              </motion.form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export default EditUsername;
