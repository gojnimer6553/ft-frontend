import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import useSession from "@/hooks/queries/user";
import { toast } from "sonner";

export const Route = createFileRoute("/__authenticatedLayout/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Update Name
  const nameSchema = z.object({ name: z.string().min(1) });
  const nameForm = useForm<{ name: string }>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: session?.name ?? "" },
  });
  useEffect(() => {
    nameForm.reset({ name: session?.name ?? "" });
  }, [session]);
  const nameMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => account.updateName(name),
    onSuccess: (_, values) => {
      queryClient.setQueryData(["session"], (old: any) => ({ ...old, name: values.name }));
      toast.success("Name updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Update Email
  const emailSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });
  const emailForm = useForm<{ email: string; password: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: session?.email ?? "", password: "" },
  });
  useEffect(() => {
    emailForm.reset({ email: session?.email ?? "", password: "" });
  }, [session]);
  const emailMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      account.updateEmail(email, password),
    onSuccess: (_, values) => {
      queryClient.setQueryData(["session"], (old: any) => ({ ...old, email: values.email }));
      toast.success("Email updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Update Password
  const passwordSchema = z.object({
    oldPassword: z.string().min(1),
    password: z.string().min(8),
  });
  const passwordForm = useForm<{ oldPassword: string; password: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", password: "" },
  });
  const passwordMutation = useMutation({
    mutationFn: ({ password, oldPassword }: { password: string; oldPassword: string }) =>
      account.updatePassword(password, oldPassword),
    onSuccess: () => {
      toast.success("Password updated");
      passwordForm.reset();
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Update Phone
  const phoneSchema = z.object({
    phone: z.string().min(1),
    password: z.string().min(1),
  });
  const phoneForm = useForm<{ phone: string; password: string }>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: session?.phone ?? "", password: "" },
  });
  useEffect(() => {
    phoneForm.reset({ phone: session?.phone ?? "", password: "" });
  }, [session]);
  const phoneMutation = useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) =>
      account.updatePhone(phone, password),
    onSuccess: () => {
      toast.success("Phone updated");
      phoneForm.reset({ phone: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Update Preferences
  const prefsSchema = z.object({
    language: z.string().min(1),
    newsletter: z.boolean().optional(),
  });
  const prefsForm = useForm<{ language: string; newsletter?: boolean }>({
    resolver: zodResolver(prefsSchema),
    defaultValues: {
      language: (session?.prefs as any)?.language ?? "",
      newsletter: (session?.prefs as any)?.newsletter ?? false,
    },
  });
  useEffect(() => {
    prefsForm.reset({
      language: (session?.prefs as any)?.language ?? "",
      newsletter: (session?.prefs as any)?.newsletter ?? false,
    });
  }, [session]);
  const prefsMutation = useMutation({
    mutationFn: ({ language, newsletter }: { language: string; newsletter?: boolean }) =>
      account.updatePrefs({ language, newsletter }),
    onSuccess: (_, values) => {
      queryClient.setQueryData(["session"], (old: any) => ({
        ...old,
        prefs: { ...(old?.prefs ?? {}), language: values.language, newsletter: values.newsletter },
      }));
      toast.success("Preferences updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Sessions
  const { data: sessionsData, refetch: refetchSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => (await account.listSessions()).sessions,
  });
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => account.deleteSession(id),
    onSuccess: () => {
      toast.success("Session removed");
      refetchSessions();
    },
    onError: (err: any) => toast.error(err.message),
  });
  const deleteAllSessionsMutation = useMutation({
    mutationFn: () => account.deleteSessions(),
    onSuccess: () => {
      toast.success("All sessions removed");
      refetchSessions();
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...nameForm}>
            <form
              className="space-y-4"
              onSubmit={nameForm.handleSubmit((v) => nameMutation.mutate(v))}
            >
              <FormField
                control={nameForm.control}
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
              <Button type="submit" loading={nameMutation.status === "pending"}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Email</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              className="space-y-4"
              onSubmit={emailForm.handleSubmit((v) => emailMutation.mutate(v))}
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" loading={emailMutation.status === "pending"}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              className="space-y-4"
              onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}
            >
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" loading={passwordMutation.status === "pending"}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Phone</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...phoneForm}>
            <form
              className="space-y-4"
              onSubmit={phoneForm.handleSubmit((v) => phoneMutation.mutate(v))}
            >
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={phoneForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" loading={phoneMutation.status === "pending"}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...prefsForm}>
            <form
              className="space-y-4"
              onSubmit={prefsForm.handleSubmit((v) => prefsMutation.mutate(v))}
            >
              <FormField
                control={prefsForm.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={prefsForm.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Newsletter</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" loading={prefsMutation.status === "pending"}>
                Save
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessionsData?.map((s) => (
            <div key={s.$id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm">{s.clientName} - {s.osName}</p>
                <p className="text-xs text-muted-foreground">{new Date(s.expire).toLocaleString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteSessionMutation.mutate(s.$id)}
              >
                Revoke
              </Button>
            </div>
          ))}
          {sessionsData && sessionsData.length > 0 && (
            <Button
              variant="destructive"
              loading={deleteAllSessionsMutation.status === "pending"}
              onClick={() => deleteAllSessionsMutation.mutate()}
            >
              Revoke All Sessions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;

