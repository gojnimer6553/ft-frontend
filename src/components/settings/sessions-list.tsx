import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";

export function SessionsList({ className }: { className?: string }) {
  const { data: sessionsData, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => (await account.listSessions()).sessions,
  });
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => account.deleteSession(id),
    onSuccess: () => {
      toast.success("Session removed");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });
  const deleteAllSessionsMutation = useMutation({
    mutationFn: () => account.deleteSessions(),
    onSuccess: () => {
      toast.success("All sessions removed");
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className={`space-y-4 rounded-lg border p-4 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold">Sessions</h2>
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
      </div>
    </div>
  );
}
