import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function Step({
  number,
  title,
  isActive,
}: {
  number: string
  title: string
  isActive: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4"
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-full text-base font-semibold transition-colors duration-200 border",
          isActive
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-background text-muted-foreground border-border"
        )}
        aria-current={isActive ? "step" : undefined}
      >
        {number}
      </div>
      <span
        className={cn(
          "transition-colors duration-200",
          isActive
            ? "text-foreground font-semibold"
            : "text-muted-foreground font-medium"
        )}
      >
        {title}
      </span>
    </motion.div>
  )
}

export function Divider({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.95 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex-1 h-[2px] mx-4 hidden sm:block rounded-full transition-colors duration-200",
        isActive ? "bg-primary" : "bg-border"
      )}
      aria-hidden="true"
    />
  )
}