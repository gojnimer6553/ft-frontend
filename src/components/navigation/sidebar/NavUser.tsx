"use client";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useSession from "@/hooks/queries/user";
import { account } from "@/lib/appwrite";
import { getInitials } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { toast } from "sonner";

const LogoutItem = () => {
  const navigate = useNavigate();
  const logoutMutation = useMutation({
    mutationFn: () => {
      const promise = account.deleteSession("current");
      toast.promise(promise, {
        loading: "Fazendo logout...",
        success: () => {
          return `Deslogado com sucesso!`;
        },
      });
      return promise;
    },
    onSuccess: () => {
      sessionStorage.setItem("logged-out", "true");
      navigate({
        to: "/login",
      });
    },
  });
  return (
    <DropdownMenuItem
      disabled={logoutMutation.status === "pending"}
      onClick={() => logoutMutation.mutate()}
    >
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
};

export function NavUser() {
  const { t } = useTranslate();
  const { data } = useSession();
  const { isMobile } = useSidebar();
  if (!data) return;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={undefined /* TEMP UNAVAIABLE */}
                  alt={data.name}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(data.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{data.name}</span>
                <span className="truncate text-xs">{data.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={undefined /* TEMP UNAVAIABLE */}
                    alt={data.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(data.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.name}</span>
                  <span className="truncate text-xs">{data.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings />
                {t("settings.title")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <LogoutItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
