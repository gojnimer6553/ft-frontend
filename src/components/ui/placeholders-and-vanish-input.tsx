import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PlaceholdersAndVanishInputProps extends React.ComponentProps<typeof Input> {
  placeholders: string[];
}

export function PlaceholdersAndVanishInput({
  placeholders,
  value,
  className,
  ...props
}: PlaceholdersAndVanishInputProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (value) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % placeholders.length),
      3000
    );
    return () => clearInterval(id);
  }, [value, placeholders.length]);

  const currentPlaceholder = placeholders[index];

  return (
    <div className={cn("relative", className)}>
      <Input
        {...props}
        value={value}
        className="placeholder-transparent"
      />
      <AnimatePresence>
        {!value && (
          <motion.span
            key={currentPlaceholder}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          >
            {currentPlaceholder}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
