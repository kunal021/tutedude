import React, { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import api from "@/services/axios";
import { ApiError, PasswordUpdateError } from "@/types";
import { Loader2 } from "lucide-react";
import ErrorDisplay from "../error/ErrorDisplay";

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

function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const mutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await api.patch("/api/v1/user/change-password", data);
    },
    onSuccess: () => {
      setIsOpen(false);
      console.log("Success Updating Password");
    },
    onError: (error: ApiError<PasswordUpdateError>) => {
      console.error("Error Updating Password:", error);
    },
  });

  const { mutate, isSuccess, error, isError, isPending } = mutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please fill in all fields.");
      return;
    }
    mutate({ currentPassword, newPassword });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="text-base py-2 px-8 bg-green-50 hover:bg-green-100 border-2 border-green-500 text-black transition-all duration-200 ease-in-out"
        >
          Change Password
        </Button>
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
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and a new password to change it.
                </DialogDescription>
              </DialogHeader>
              <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4 mt-4"
              >
                {[
                  {
                    id: "currentPassword",
                    label: "Current Password",
                    type: "text",
                  },
                  { id: "newPassword", label: "New Password", type: "text" },
                ].map((field) => (
                  <motion.div
                    key={field.id}
                    variants={itemVariants}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <Label
                      htmlFor={field.id}
                      className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                    >
                      {field.label}
                    </Label>
                    <motion.div variants={inputVariants} className="relative">
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.label}
                        className="w-full bg-transparent border-none text-gray-800 dark:text-white text-lg font-semibold focus:ring-0 focus:outline-none p-0 focus:shadow-none placeholder-gray-400 dark:placeholder-gray-600"
                        value={
                          field.id === "currentPassword"
                            ? currentPassword
                            : newPassword
                        }
                        onChange={
                          field.id === "currentPassword"
                            ? (e) => setCurrentPassword(e.target.value)
                            : (e) => setNewPassword(e.target.value)
                        }
                      />
                    </motion.div>
                  </motion.div>
                ))}

                <div className="flex justify-center items-center">
                  {isError && <ErrorDisplay error={error} isError={isError} />}
                  {isSuccess && (
                    <p style={{ color: "green" }}>
                      Password change successful!
                    </p>
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
                    "Change Password"
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

export default ChangePassword;
