import { useMutation } from "@tanstack/react-query";
import { ThemeToggle } from "../extra/ThemeToggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import api from "@/services/axios";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function SideBar({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const mutation = useMutation({
    mutationFn: () => {
      return api.post(`/api/v1/auth/logout`);
    },
    onSuccess: () => {
      logout();
      navigate("/auth/login");
      console.log("Success logging out");
    },
    onError: (error) => {
      console.error("Error logging out:", error);
    },
  });

  const { mutate, isPending } = mutation;

  const handleLogout = () => mutate();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 bg-sidebar">
          <div className="flex justify-center items-center gap-2">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <ThemeToggle />
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
                disabled={isPending}
                onClick={handleLogout}
                variant="secondary"
                className="bg-lime-50 hover:bg-lime-100 border-2 border-lime-500 text-black transition-all duration-200 ease-in-out"
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4"></Loader2>
                ) : (
                  "Logout"
                )}
              </Button>
            </motion.div>
          </div>
        </header>
        <>{children}</>
      </SidebarInset>
    </SidebarProvider>
  );
}
