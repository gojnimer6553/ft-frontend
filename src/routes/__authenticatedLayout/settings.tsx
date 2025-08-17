import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PasswordPrompt } from "@/components/password-prompt";
import { account } from "@/lib/appwrite";
import tolgee from "@/lib/tolgee";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: SettingsPage,
});

type FormValues = {
  name: string;
  email: string;
  password: string;
  language: string;
  prefs: string;
};

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      language: "en",
      prefs: "{}",
    },
  });

  useEffect(() => {
    if (session) {
      formMethods.reset({
        name: session.name,
        email: session.email,
        password: "",
        language: session.prefs?.language ?? "en",
        prefs: JSON.stringify(session.prefs ?? {}, null, 2),
      });
    }
  }, [session, formMethods]);

  const nameMutation = useMutation({
    mutationFn: (name: string) => account.updateName(name),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data);
      toast.success("Name updated");
    },
  });

  const emailMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      account.updateEmail(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data);
      toast.success("Email updated");
    },
  });
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
  const [promptOpen, setPromptOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const watchedValues = formMethods.watch();
  const hasChanges = useMemo(() => {
    if (!session) return false;
    return (
      watchedValues.name !== session.name ||
      watchedValues.email !== session.email ||
      watchedValues.password !== "" ||
      watchedValues.language !== (session.prefs?.language ?? "en") ||
      watchedValues.prefs !== JSON.stringify(session.prefs ?? {}, null, 2)
    );
  }, [watchedValues, session]);

  const handleSave = async (values: FormValues, password?: string) => {
    setIsSaving(true);
    try {
      if (values.name !== session?.name) {
        await nameMutation.mutateAsync(values.name);
      }
      if (values.email !== session?.email) {
        if (!password) throw new Error("Password required");
        await emailMutation.mutateAsync({ email: values.email, password });
      }
      if (values.password) {
        if (!password) throw new Error("Password required");
        await passwordMutation.mutateAsync({ password: values.password, old: password });
      }
      if (
        values.language !== session?.prefs?.language ||
        values.prefs !== JSON.stringify(session?.prefs ?? {}, null, 2)
      ) {
        const parsed = JSON.parse(values.prefs);
        parsed.language = values.language;
        await prefsMutation.mutateAsync(parsed);
        tolgee.changeLanguage(values.language);
      }

      const updated: any = queryClient.getQueryData(["session"]);
      formMethods.reset({
        name: updated?.name ?? values.name,
        email: updated?.email ?? values.email,
        password: "",
        language: updated?.prefs?.language ?? values.language,
        prefs: JSON.stringify(updated?.prefs ?? {}, null, 2),
      });
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON");
      } else if (err?.message) {
        toast.error(err.message);
      }
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      JSON.parse(values.prefs);
    } catch {
      toast.error("Invalid JSON");
      return;
    }

    if (values.email !== session?.email || values.password) {
      setPendingValues(values);
      setPromptOpen(true);
    } else {
      try {
        await handleSave(values);
      } catch {}
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-10">
      <Form {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <FormField
            control={formMethods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

  
          <FormField
            control={formMethods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <option value="en">English</option>
                    <option value="pt-BR">Português (Brasil)</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="prefs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferences (JSON)</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!hasChanges || isSaving}>
            Save changes
          </Button>
        </form>
      </Form>

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

      <PasswordPrompt
        open={promptOpen}
        onCancel={() => {
          setPromptOpen(false);
          setPendingValues(null);
        }}
        onConfirm={async (password) => {
          if (pendingValues) {
            await handleSave(pendingValues, password);
            setPendingValues(null);
          }
        }}
      />
    </div>
  );
}
