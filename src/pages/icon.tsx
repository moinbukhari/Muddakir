import { motion } from "framer-motion";
type Type = "correct" | "incorrect" | "skipped";

export const IconOnly = ({
  type,
  size = 16,
  ...props
}: {
  type: Type;
  size?: number;
} & Omit<React.ComponentPropsWithoutRef<typeof motion["path"]>, "type">) => {
  const iconMap: Record<Type, string> = {
    correct: "M 4 8 L 7 10.8 L 12 4",
    incorrect: "M 3 3 L 12 12 M 3 12 L 12 3",
    skipped: "M 2.8 7.5 H 12.2",
  };
  return (
    <svg viewBox="0 0 15 15" width={size} height={size}>
      <motion.path
        className="stroke-gray12"
        d={iconMap[type]}
        fill="none"
        strokeLinecap="round"
        strokeWidth="1.2"
        animate={{ pathLength: 1 }}
        initial={{ pathLength: 0 }}
        transition={{ type: "spring", damping: 20 }}
        {...props}
      />
    </svg>
  );
};
