"use client";

import React, { useState, useEffect } from "react";
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
// import { DocumentHistory } from "@/components/document-history";
import { OpenDocument } from "@/components/open-document";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loading } from "@/components/loading";

const DocumentHistory = dynamic(
  () => import("@/components/document-history").then((mod) => mod.default),
  {
    loading: () => <Loading />,
  }
);

export function AppSidebar({
  enableEdits,
  setEnableEdits,
  socket,
  enableView,
  setEnableView,
}: {
  enableEdits: boolean;
  setEnableEdits: any;
  socket: any;
  enableView: boolean;
  setEnableView: any;
}) {
  const navMain = [
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
      component: <DocumentHistory socket={socket} setOpen={() => {}} />,
    },
  ];

  const navSecondary = [
    {
      title: "Recent",
      url: "#",
      icon: Rows3,
      isActive: true,
      items: [],
    },
    {
      title: "Starred",
      url: "#",
      icon: Star,
      items: [],
    },
    // {
    //   title: "Download",
    //   url: "#",
    //   icon: Download,
    //   items: [
    //     {
    //       title: "PDF Document (.pdf)",
    //       url: "#",
    //     },
    //     {
    //       title: "Microsoft Word (.docx)",
    //       url: "#",
    //     },
    //     {
    //       title: "Plain Text (.txt)",
    //       url: "#",
    //     },
    //     {
    //       title: "Markdown (.md)",
    //       url: "#",
    //     },
    //   ],
    // },
  ];

  const navThird = [
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
  ];

  const { toast } = useToast();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
      setData({ ...data, user: user });
    }
  }, []);

  const [data, setData] = useState({
    user: user,
    navMain: navMain,
    navSecondary: navSecondary,
    navThird: navThird,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/starred-and-recents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const recents = res.data.recents
            .filter((item: any) => item !== null)
            .map((item: any) => {
              const { title, documentId } = item;
              return { title, url: `/${documentId}` };
            });

          const starred = res.data.starred.map((item: any) => {
            const { title, documentId } = item;
            return { title, url: `/${documentId}` };
          });

          setData({
            ...data,
            navSecondary: [
              {
                ...data.navSecondary[0],
                items: recents,
              },
              {
                ...data.navSecondary[1],
                items: starred,
              },
              ...data.navSecondary.slice(2),
            ],
          });
        })
        .catch((err) => {});
    }
  }, []);

  return (
    <Sidebar variant="inset">
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
        <NavMain
          items={data.navMain}
          enableEdits={enableEdits}
          enableView={enableView}
          socket={socket}
        />
        <NavSecondary items={data.navSecondary} />
        <NavThird items={data.navThird} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
