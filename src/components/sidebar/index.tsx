"use client";

import {
  Calendar,
  Command,
  LifeBuoy,
  Send,
  Bot,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { ContactCredenza } from "@/components/contact-credenza";
import { FeedbackCredenza } from "@/components/feedback-credenza";
import { NavUser } from "@/components/sidebar/nav-user";
import { Menu } from "@/components/sidebar/menu";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const sidebar = useStore(useSidebar, (s) => s);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  const groups = [
    {
      groupLabel: "",
      menus: [
        { href: "/chat", label: "Chat", icon: Bot },
        { href: "/home", label: "Calendário", icon: Calendar },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          label: "Support",
          icon: LifeBuoy,
          render: (open: boolean | undefined) => (
            <ContactCredenza>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 mb-1"
                    >
                      <span className={cn(open === false ? "" : "mr-4")}> 
                        <LifeBuoy size={18} />
                      </span>
                      <p
                        className={cn(
                          "max-w-[200px] truncate",
                          open === false
                            ? "-translate-x-96 opacity-0"
                            : "translate-x-0 opacity-100"
                        )}
                      >
                        Support
                      </p>
                    </Button>
                  </TooltipTrigger>
                  {open === false && (
                    <TooltipContent side="right">Support</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </ContactCredenza>
          ),
        },
        {
          label: "Feedback",
          icon: Send,
          render: (open: boolean | undefined) => (
            <FeedbackCredenza>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 mb-1"
                    >
                      <span className={cn(open === false ? "" : "mr-4")}> 
                        <Send size={18} />
                      </span>
                      <p
                        className={cn(
                          "max-w-[200px] truncate",
                          open === false
                            ? "-translate-x-96 opacity-0"
                            : "translate-x-0 opacity-100"
                        )}
                      >
                        Feedback
                      </p>
                    </Button>
                  </TooltipTrigger>
                  {open === false && (
                    <TooltipContent side="right">Feedback</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </FeedbackCredenza>
          ),
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link to="/home" className="flex items-center gap-2">
            <Command className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              Food Tracker
            </h1>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} groups={groups} />
        <div className="mt-auto px-2">
          <NavUser isOpen={getOpenState()} />
        </div>
      </div>
    </aside>
  );
}
