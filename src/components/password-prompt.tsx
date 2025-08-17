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
  onConfirm: (password: string) => Promise<void> | void;
  onCancel: () => void;
}

export function PasswordPrompt({ open, onConfirm, onCancel }: PasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setPassword("");
    setError(null);
    onCancel();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(password);
      handleClose();
    } catch (err: any) {
      setError(err?.message ?? "Invalid password");
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
        />
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting || !password}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordPrompt;
