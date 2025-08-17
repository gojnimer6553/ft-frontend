import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InputWithButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  buttonLabel: string;
  loading?: boolean | string;
}

export const InputWithButton = React.forwardRef<HTMLInputElement, InputWithButtonProps>(
  ({ className, buttonLabel, loading, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input ref={ref} className={cn("pr-28", className)} {...props} />
        <Button
          type="submit"
          size="sm"
          loading={loading}
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          {buttonLabel}
        </Button>
      </div>
    );
  }
);
InputWithButton.displayName = "InputWithButton";
