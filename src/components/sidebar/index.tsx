import * as React from "react";
import {
  Calendar,
  Command,
  LifeBuoy,
  Send,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { ContactCredenza } from "@/components/contact-credenza";
import { FeedbackCredenza } from "@/components/feedback-credenza";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslate } from "@tolgee/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslate();
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Chat",
        url: "/chat",
        icon: Bot,
      },
      {
        title: "Calendário",
        url: "/home",
        icon: Calendar,
        items: [
          {
            title: "Início",
            url: "/home",
          },
        ],
      },
      {
        title: t("settings.title"),
        url: "/settings",
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        icon: LifeBuoy,
        render: (item: { title: string; icon: LucideIcon }) => (
          <ContactCredenza>
            <SidebarMenuButton size="sm">
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </ContactCredenza>
        ),
      },
      {
        title: "Feedback",
        icon: Send,
        render: (item: { title: string; icon: LucideIcon }) => (
          <FeedbackCredenza>
            <SidebarMenuButton size="sm">
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </FeedbackCredenza>
        ),
      },
    ],
    projects: [],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
