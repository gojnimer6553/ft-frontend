import { account } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";

export type UserPreferences = Models.Preferences & {
  language?: string;
};

const useSession = () => {
  return useQuery<Models.User<UserPreferences>>({
    queryKey: ["session"],
    queryFn: () => account.get<UserPreferences>(),
  });
};

export default useSession;
