import * as React from "react";
import { Portal as RadixPortal } from "@radix-ui/react-portal";

interface PortalProps {
  containerId: string;
  children: React.ReactNode;
}

export function Portal({ containerId, children }: PortalProps) {
  const container =
    typeof document !== "undefined"
      ? document.getElementById(containerId)
      : null;
  if (!container) return null;
  return <RadixPortal container={container}>{children}</RadixPortal>;
}
