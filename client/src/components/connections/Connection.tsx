import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import ConnectionList from "./ConnectionList";
import ConnectionRequest from "./ConnectionRequest";
const Connection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"connections" | "requests">(
    "connections"
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-2 xs:p-4 sm:p-8 flex items-center justify-center">
      <LayoutGroup>
        <motion.div
          className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <div className="flex border-b dark:border-gray-700">
            {["connections", "requests"].map((tab) => (
              <motion.button
                key={tab}
                className={`flex-1 py-2 px-1 xs:py-3 xs:px-2 sm:py-4 sm:px-6 text-xs xs:text-sm sm:text-lg font-semibold transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-lime-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab as "connections" | "requests")}
                layout
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                {activeTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 xs:h-1 bg-lime-600"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 xs:p-4 sm:p-6"
            >
              {activeTab === "connections" ? (
                <ConnectionList />
              ) : (
                <ConnectionRequest />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
};

export default Connection;
