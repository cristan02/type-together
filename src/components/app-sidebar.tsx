"use client";

import * as React from "react";
import {
  Command,
  FileText,
  Folder,
  Trash2,
  History,
  Rows3,
  Star,
  Download,
  LifeBuoy,
  Send,
  Component,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavThird } from "@/components/nav-third";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeChanger } from "@/components/theme-changer";
import { CreateDocument } from "@/components/create-document";
import { DeleteDocument } from "@/components/delete-document";
import { DocumentHistory } from "@/components/document-history";
import { OpenDocument } from "@/components/open-document";

const data = {
  user: {
    name: "Ashbourn",
    email: "ashbourn@mitwpu.edu.in",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      name: "New",
      url: "#",
      icon: FileText,
      componentTitle: "Create Document",
      component: <CreateDocument />,
    },
    {
      name: "Open",
      url: "#",
      icon: Folder,
      componentTitle: "Open Document",
      component: <OpenDocument />,
    },
    {
      name: "Delete",
      url: "#",
      icon: Trash2,
      componentTitle: "Delete Document",
      component: <DeleteDocument />,
    },
    {
      name: "History",
      url: "#",
      icon: History,
      componentTitle: "Document History",
      component: <DocumentHistory />,
    },
  ],
  navSecondary: [
    {
      title: "Recent",
      url: "#",
      icon: Rows3,
      isActive: true,
      items: [
        {
          title: "one",
          url: "#",
        },
        {
          title: "two",
          url: "#",
        },
        {
          title: "three",
          url: "#",
        },
      ],
    },
    {
      title: "Starred",
      url: "#",
      icon: Star,
      items: [
        {
          title: "one",
          url: "#",
        },
        {
          title: "two",
          url: "#",
        },
        {
          title: "three",
          url: "#",
        },
      ],
    },
    {
      title: "Download",
      url: "#",
      icon: Download,
      items: [
        {
          title: "PDF Document (.pdf)",
          url: "#",
        },
        {
          title: "Microsoft Word (.docx)",
          url: "#",
        },
        {
          title: "Plain Text (.txt)",
          url: "#",
        },
        {
          title: "Markdown (.md)",
          url: "#",
        },
      ],
    },
  ],
  navThird: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ThemeChanger>
                    <Command className="size-4 cursor-pointer" />
                  </ThemeChanger>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Type Together</span>
                  <span className="truncate font-semibold"></span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
        <NavThird items={data.navThird} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
