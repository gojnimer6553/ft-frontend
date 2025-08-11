"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

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
import { useNavigate } from "@tanstack/react-router";
import { account } from "@/lib/appwrite";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useSession from "@/hooks/queries/user";
import { getInitials } from "@/lib/utils";

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
            {/*             
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <LogoutItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
