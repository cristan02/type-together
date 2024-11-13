"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { AnyAaaaRecord } from "dns";

export function ComboboxDemo({
  data,
  value,
  setValue,
}: {
  data: { value: string; label: string }[];
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((item) => item.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" max-w-xs p-0">
        <Command className=" w-full">
          <CommandList className="w-full">
            <CommandEmpty className="w-full">Not found.</CommandEmpty>
            <CommandGroup className="w-full">
              {data.map((item) => (
                <CommandItem
                  className="w-full"
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ComboboxDemo2({
  userId,
  permissionChoices,
  permission,
  accessId,
  myAccessPermission,
  setMyAccessPermission,
  setUsersAccess,
}: {
  userId: string;
  permissionChoices: { value: string; label: string }[];
  permission: "edit" | "view";
  accessId: string;
  myAccessPermission: string;
  setMyAccessPermission: any;
  setUsersAccess: any;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(permission);
  const { toast } = useToast();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  const handleUserAccessChange = (userPermission: string) => {
    if (myAccessPermission === "view") {
      toast({
        variant: "destructive",
        title: "You do not have permission to update user document access",
      });
      return;
    }

    if (userId === user.documentId) {
      toast({
        variant: "destructive",
        title: "You cannot update your own access",
      });
      return;
    }

    if (typeof window !== "undefined") {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/accesses/${accessId}?populate=user`,
          {
            data: {
              permission: userPermission,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          toast({
            title: "User access updated",
          });

          console.log(res.data);
          const updatedUsersAccess = {
            userId: res.data.data.user.documentId,
            accessId: res.data.data.documentId,
            username: res.data.data.user.username,
            email: res.data.data.user.email,
            avatar: res.data.data.user.avatar,
            permission: res.data.data.permission,
          };

          setUsersAccess((prev: any) => {
            return prev.map((item: any) => {
              if (item.userId === userId) {
                return updatedUsersAccess;
              }
              return item;
            });
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to update user document access",
            description: err.response.data.message,
          });
        });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? permissionChoices.find((item) => item.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" max-w-xs p-0">
        <Command className=" w-full">
          <CommandList className="w-full">
            <CommandGroup className="w-full">
              {permissionChoices.map((item) => (
                <CommandItem
                  className="w-full"
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    if (myAccessPermission === "view") {
                      toast({
                        variant: "destructive",
                        title:
                          "You do not have permission to update user document access",
                      });
                      return;
                    }
                    setValue(currentValue);
                    setOpen(false);

                    if (value !== currentValue) {
                      handleUserAccessChange(currentValue);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
