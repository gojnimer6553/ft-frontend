import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PasswordPromptProps {
  open: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
}

export function PasswordPrompt({ open, onConfirm, onCancel }: PasswordPromptProps) {
  const [password, setPassword] = useState("");

  const handleClose = () => {
    setPassword("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Password</DialogTitle>
          <DialogDescription>
            Enter your current password to continue.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(password);
              setPassword("");
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordPrompt;
