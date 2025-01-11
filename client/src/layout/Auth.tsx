import { useState, useEffect } from "react";
import { Login } from "@/components/auth/Login";
import { Signup } from "@/components/auth/Signup";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import AuthImagePattern from "@/components/auth/AuthImagePattern";

export default function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === "/auth/login");
    setIsSignup(location.pathname === "/auth/signup");
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left column - Auth form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="sidebarScroll w-full md:w-1/2 overflow-y-auto"
      >
        <div className="min-h-full p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin && <Login />}
              {isSignup && <Signup />}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right column - Product information */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 via-lime-500 to-lime-700 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-600/50 to-transparent" />
        <div className="relative z-10 w-full h-full">
          <AuthImagePattern
            title="Join our community"
            subtitle="Connect with people, make friends, and share your thoughts."
          />
        </div>
      </motion.div>
    </div>
  );
}
