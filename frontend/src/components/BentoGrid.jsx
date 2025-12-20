import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}) => {
  return (
    <motion.div
      className={clsx(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-surface dark:border-white/[0.1] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
