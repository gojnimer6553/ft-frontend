import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PasswordPrompt } from "@/components/password-prompt";
import { account } from "@/lib/appwrite";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prefs, setPrefs] = useState("{}");

  useEffect(() => {
    if (session) {
      setName(session.name);
      setEmail(session.email);
      setPrefs(JSON.stringify(session.prefs ?? {}, null, 2));
    }
  }, [session]);

  const nameMutation = useMutation({
    mutationFn: (name: string) => account.updateName(name),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data);
      toast.success("Name updated");
    },
  });

  const [pendingEmail, setPendingEmail] = useState("");
  const [emailPromptOpen, setEmailPromptOpen] = useState(false);
  const emailMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      account.updateEmail(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data);
      toast.success("Email updated");
    },
  });

  const [pendingPassword, setPendingPassword] = useState("");
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const passwordMutation = useMutation({
    mutationFn: ({ password, old }: { password: string; old: string }) =>
      account.updatePassword(password, old),
    onSuccess: () => {
      toast.success("Password updated");
    },
  });

  const prefsMutation = useMutation({
    mutationFn: (prefs: Record<string, unknown>) => account.updatePrefs(prefs),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data);
      toast.success("Preferences updated");
    },
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => account.listSessions().then((res: any) => res.sessions),
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => account.deleteSession(id),
    onSuccess: () => {
      toast.success("Session deleted");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nameMutation.mutate(name);
          }}
          className="space-y-2"
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" disabled={nameMutation.isPending}>
            Save name
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Email</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPendingEmail(email);
            setEmailPromptOpen(true);
          }}
          className="space-y-2"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={emailMutation.isPending}>
            Save email
          </Button>
        </form>
        <PasswordPrompt
          open={emailPromptOpen}
          onCancel={() => setEmailPromptOpen(false)}
          onConfirm={(password) => {
            emailMutation.mutate({ email: pendingEmail, password });
            setEmailPromptOpen(false);
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPendingPassword(pendingPassword);
            setPasswordPromptOpen(true);
          }}
          className="space-y-2"
        >
          <Input
            type="password"
            value={pendingPassword}
            onChange={(e) => setPendingPassword(e.target.value)}
            placeholder="New password"
          />
          <Button type="submit" disabled={passwordMutation.isPending}>
            Change password
          </Button>
        </form>
        <PasswordPrompt
          open={passwordPromptOpen}
          onCancel={() => setPasswordPromptOpen(false)}
          onConfirm={(oldPassword) => {
            passwordMutation.mutate({ password: pendingPassword, old: oldPassword });
            setPasswordPromptOpen(false);
            setPendingPassword("");
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const parsed = JSON.parse(prefs);
              prefsMutation.mutate(parsed);
            } catch {
              toast.error("Invalid JSON");
            }
          }}
          className="space-y-2"
        >
          <Textarea
            value={prefs}
            onChange={(e) => setPrefs(e.target.value)}
            rows={5}
          />
          <Button type="submit" disabled={prefsMutation.isPending}>
            Save preferences
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Active Sessions</h2>
        <ul className="space-y-2">
          {sessionsQuery.data?.map((s: any) => (
            <li
              key={s.$id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div>
                <p className="font-medium">
                  {s.clientName || "Unknown"} {s.osName ? `- ${s.osName}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(s.expire * 1000).toLocaleString()}
                </p>
              </div>
              {s.current ? (
                <span className="text-xs text-muted-foreground">Current</span>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSessionMutation.mutate(s.$id)}
                  disabled={deleteSessionMutation.isPending}
                >
                  Delete
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
