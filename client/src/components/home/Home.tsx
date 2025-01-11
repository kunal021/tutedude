import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../extra/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-white dark:bg-black">
      <div className="fixed top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="fixed top-1/2 right-24 w-[28rem] h-[28rem] bg-lime-500/30 rounded-full blur-3xl" />
      <div className="fixed top-24 -right-24 w-72 h-72 bg-lime-200/50 rounded-full blur-3xl" />

      <div className="relative w-full min-h-screen flex items-center justify-center z-20">
        <div
          className={`${
            theme === "dark" ? "darkback" : "lightback"
          } flex flex-col justify-center items-center`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="text-center max-w-3xl p-8"
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1
                className="text-5xl md:text-8xl font-bold text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Tute<span className="text-lime-500">Gram</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-2xl md:text-3xl font-bold text-lime-500 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your Ultimate Platform for connecting with people and making new
              friends
            </motion.p>
          </motion.div>
          <motion.div
            className="absolute bottom-12 md:left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="w-6 h-10 border-2 border-lime-500 rounded-full flex justify-center items-start">
              <motion.div
                className="w-2 h-2 bg-lime-500 rounded-full"
                animate={{
                  y: [0, 6, 0],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>
            <p className="text-sm text-lime-500 mt-2">Scroll Down</p>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="mt-16 w-full max-w-5xl z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.div className="flex flex-col items-center justify-center">
          <motion.p
            className="text-2xl md:text-5xl font-bold mb-8 text-black dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join Tute<span className="text-lime-500">Gram</span> Now
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2lg md:text-4xl text-center font-bold mb-8 text-lime-500"
          >
            Find new peoples, make new friends, and build a strong community.
          </motion.p>
          <motion.button
            onClick={() => navigate("/auth/signup")}
            className="px-8 py-4 bg-lime-50 text-lime-500 rounded-full border-2 border-lime-500 font-bold text-lg hover:bg-lime-100 transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join <span className="text-black">Tute</span>
            <span className="text-lime-500">Gram</span> Now
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.footer
        className="mt-16 text-center text-lime-700 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        © 2025 TuteGram. All rights reserved.
      </motion.footer>
    </div>
  );
};

export default Home;
