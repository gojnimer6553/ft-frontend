import * as React from "react";
import {
  Calendar,
  Command,
  LifeBuoy,
  Send,
  Bot,
  type LucideIcon,
} from "lucide-react";

import { ContactCredenza } from "@/components/contact/ContactCredenza";
import { FeedbackCredenza } from "@/components/feedback/FeedbackCredenza";

import { NavMain } from "@/components/navigation/sidebar/NavMain";
import { NavSecondary } from "@/components/navigation/sidebar/NavSecondary";
import { NavUser } from "@/components/navigation/sidebar/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
