"use client";

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
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
    componentTitle: string;
    component: React.ReactNode;
  }[];
  enableEdits: boolean;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
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

            {/* <DropdownMenu>
              {item?.component && item?.component}
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
