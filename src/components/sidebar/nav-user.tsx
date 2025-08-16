"use client";

import { LogOut, LayoutGrid } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import useSession from "@/hooks/queries/user";
import { account } from "@/lib/appwrite";
import { getInitials } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface NavUserProps {
  isOpen: boolean | undefined;
}

export function NavUser({ isOpen }: NavUserProps) {
  const { data } = useSession();
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
      navigate({ to: "/login" });
    },
  });
  if (!data) return null;
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} alt={data.name} />
                  <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {isOpen === false && (
            <TooltipContent side="right">Profile</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/home" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          disabled={logoutMutation.status === "pending"}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
