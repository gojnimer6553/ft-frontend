import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import { useTranslate } from "@tolgee/react";

export function SessionsList({ className }: { className?: string }) {
  const { t } = useTranslate();
  const { data: sessionsData, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => (await account.listSessions()).sessions,
  });
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => account.deleteSession(id),
    onSuccess: () => {
      toast.success(t("settings.sessions.sessionRemoved"));
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });
  const deleteOtherSessionsMutation = useMutation({
    mutationFn: async () => {
      const sessions = (await account.listSessions()).sessions;
      await Promise.all(sessions.filter((s) => !s.current).map((s) => account.deleteSession(s.$id)));
    },
    onSuccess: () => {
      toast.success(t("settings.sessions.otherSessionsRemoved"));
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className={`space-y-4 rounded-lg border p-4 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold">{t("settings.sessions.title")}</h2>
      <div className="space-y-2">
        {sessionsData?.map((s) => (
          <div key={s.$id} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="text-sm">{s.clientName} - {s.osName}</p>
              <p className="text-xs text-muted-foreground">{new Date(s.expire).toLocaleString()}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={s.current}
              onClick={() => deleteSessionMutation.mutate(s.$id)}
            >
              {t("settings.sessions.revoke")}
            </Button>
          </div>
        ))}
        {sessionsData && sessionsData.some((s) => !s.current) && (
          <Button
            variant="destructive"
            loading={deleteOtherSessionsMutation.status === "pending"}
            onClick={() => deleteOtherSessionsMutation.mutate()}
          >
            {t("settings.sessions.revokeOthers")}
          </Button>
        )}
      </div>
    </div>
  );
}
