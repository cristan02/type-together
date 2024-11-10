"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ComboboxDemo2 } from "@/components/ui/ComboboxDemo";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockKeyhole, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Share = () => {
  const { toast } = useToast();
  const data = [
    {
      value: "edit",
      label: "Edit",
    },
    {
      value: "view",
      label: "View",
    },
    {
      value: "comment",
      label: "Comment",
    },
  ];

  const members = [
    {
      name: "Ashbourn",
      email: "ashbourn@mitwpu.edu.in",
      avatar: "/avatars/shadcn.jpg",
    },
    {
      name: "Ashbourn",
      email: "ashbourn@mitwpu.edu.in",
      avatar: "/avatars/shadcn.jpg",
    },
  ];

  const [access, setAccess] = useState("closed");

  const handleCopyLink = () => {
    const link = "https://your-link-here.com";
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <UserPlus className=" ml-auto size-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Share this document</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-4 w-full">
            <div className="grid gap-2 ">
              <Input id="member" type="email" placeholder="user@gmail.com" />
            </div>

            <div className=" flex flex-col gap-2">
              {members.map((user, index) => (
                <div key={index} className=" flex justify-between w-full gap-4">
                  <div className="flex items-center gap-2 w-full">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>

                  <div className=" w-48">
                    <ComboboxDemo2 data={data} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator orientation="horizontal" />

          <div className=" grid w-full gap-4">
            <h4 className="font-semibold leading-none">Document Access</h4>

            <div className=" flex justify-between items-center ">
              <div className=" flex  gap-2 items-center">
                <LockKeyhole className="size-5" />
                <div className=" flex flex-col gap-1">
                  <Select
                    value={access}
                    onValueChange={(val) => {
                      setAccess(val);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className=" text-sm px-2">
                    {access === "open"
                      ? "Anyone with the link can view"
                      : "Only invited members can view"}
                  </p>
                </div>
              </div>

              <Button className="w-24" onClick={handleCopyLink}>
                <Link />
                Link
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { Share };
