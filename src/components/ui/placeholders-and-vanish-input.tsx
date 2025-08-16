import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface PlaceholdersAndVanishInputProps
  extends React.ComponentProps<typeof Input> {
  placeholders: string[];
}

export function PlaceholdersAndVanishInput({
  placeholders,
  className,
  value,
  ...props
}: PlaceholdersAndVanishInputProps) {
  const [index, setIndex] = useState(0);
  const [vanish, setVanish] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVanish(true);
      const timeout = setTimeout(() => {
        setIndex((i) => (i + 1) % placeholders.length);
        setVanish(false);
      }, 500);
      return () => clearTimeout(timeout);
    }, 2000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const showPlaceholder =
    typeof value === "string" ? value.length === 0 : !value;

  return (
    <div className="relative w-full">
      <Input {...props} value={value} className={cn("peer", className)} />
      {showPlaceholder && (
        <span
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-opacity duration-500 peer-focus:opacity-0",
            vanish ? "opacity-0" : "opacity-100"
          )}
        >
          {placeholders[index]}
        </span>
      )}
    </div>
  );
}
