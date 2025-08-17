import * as React from "react";
import {
  OTPInput as BaseOTPInput,
  OTPInputContext,
} from "input-otp";
import type { SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof BaseOTPInput>,
  React.ComponentPropsWithoutRef<typeof BaseOTPInput>
>(({ className, ...props }, ref) => (
  <BaseOTPInput
    ref={ref}
    className={cn("flex gap-2", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex gap-2", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("px-2", className)} {...props} />
));
InputOTPSeparator.displayName = "InputOTPSeparator";

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ index, className, ...props }, ref) => {
  const context = React.useContext(OTPInputContext);
  const slot: SlotProps = context.slots[index];
  const { char, hasFakeCaret, isActive } = slot;
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md border border-input text-sm transition-all",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
