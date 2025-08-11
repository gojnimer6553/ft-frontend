import type { account } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";

const useSession = () => {
  return useQuery<Awaited<ReturnType<typeof account.get>>>({
    queryKey: ["session"],
  });
};

export default useSession;
