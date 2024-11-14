"use client";

import React, { useState } from "react";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NavMain({
  items,
  enableEdits,
  socket,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
    componentTitle: string;
    component: React.ReactNode;
  }[];
  enableEdits: boolean;
  socket: any;
}) {
  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item,index) => (
          <SidebarMenuItem key={index}>
            {!enableEdits &&
            (item.name === "History" || item.name === "Delete") ? (
              <Dialog>
                <DialogTrigger asChild disabled={!enableEdits}>
                  <SidebarMenuButton asChild>
                    <div>
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>You Do not have this permission</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ) : item.name === "History" ? (
              <Dialog
                open={open}
                onOpenChange={() => {
                  setOpen(!open);
                }}
              >
                <DialogTrigger asChild disabled={!enableEdits}>
                  <SidebarMenuButton asChild>
                    <div>
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </DialogTrigger>

                <DialogContent className=" w-full h-screen max-w-full">
                  <DialogHeader>
                    <DialogTitle>{item.componentTitle}</DialogTitle>
                  </DialogHeader>

                  {React.isValidElement(item.component) &&
                    React.cloneElement(
                      item.component as React.ReactElement<any>,
                      { socket, setOpen }
                    )}
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog>
                <DialogTrigger asChild disabled={!enableEdits}>
                  <SidebarMenuButton asChild>
                    <div>
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{item.componentTitle}</DialogTitle>
                  </DialogHeader>

                  {item?.component}
                </DialogContent>
              </Dialog>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
