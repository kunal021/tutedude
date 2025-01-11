import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ApiError, PasswordUpdateError } from "@/types";
import api from "@/services/axios";
import Cookies from "js-cookie";

function DeleteProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      return await api.delete("/api/v1/user/delete");
    },
    onSuccess: () => {
      Cookies.remove("user");
      window.location.href = "/";
      setIsOpen(false);
      console.log("Success Updating Password");
    },
    onError: (error: ApiError<PasswordUpdateError>) => {
      console.error("Error Updating Password:", error);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Trash2 className="text-red-500 ml-2 cursor-pointer" />
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
                <DialogTitle>Delete Account</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground py-5">
                Do you really want to delete your account? This action cannot be
                undone and you will lose all your data permanently from our
                server.
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"secondary"}>Cancel</Button>
                </DialogClose>
                <Button variant={"destructive"} onClick={handleDelete}>
                  {mutation.isPending ? "Deleting..." : " Yes, Delete"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export default DeleteProfile;
