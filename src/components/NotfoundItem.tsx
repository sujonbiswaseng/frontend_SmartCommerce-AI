import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export interface NotFoundItemProps {
  content: string;
  filter?: string;
  emoji?: ReactNode;
}

const NotFoundItem: React.FC<NotFoundItemProps> = ({
  content,
  filter,
  emoji,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-lg text-center rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-sm px-8 py-16 flex flex-col items-center"
        >
          <span
            className="mb-6 text-6xl sm:text-7xl select-none"
            aria-label="Status Emoji"
            role="img"
          >
            {emoji ?? "😔"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-geist text-slate-800 dark:text-zinc-100 mb-3 leading-snug">
            {content}
          </h2>
          {filter && (
            <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
              {filter}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundItem;