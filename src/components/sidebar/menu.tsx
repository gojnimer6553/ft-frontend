"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { Ellipsis } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  render?: (isOpen: boolean | undefined) => React.ReactNode;
}

interface MenuGroup {
  groupLabel?: string;
  menus: MenuItem[];
}

interface MenuProps {
  isOpen: boolean | undefined;
  groups: MenuGroup[];
}

export function Menu({ isOpen, groups }: MenuProps) {
  const location = useLocation();

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] items-start space-y-1 px-2">
          {groups.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {groupLabel && isOpen ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : groupLabel && !isOpen ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map((menu, idx) => (
                <div className="w-full" key={idx}>
                  {menu.render ? (
                    menu.render(isOpen)
                  ) : (
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              location.pathname === menu.href
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <Link to={menu.href || "#"}>
                              <span className="flex items-center">
                                <span className={cn(isOpen === false ? "" : "mr-4")}>
                                  <menu.icon size={18} />
                                </span>
                                <span
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {menu.label}
                                </span>
                              </span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">
                            {menu.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
