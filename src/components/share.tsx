"use client";

import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { LockKeyhole, Link, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Share = ({ documentId }: { documentId: string }) => {
  const { toast } = useToast();

  const permissionChoices = [
    {
      value: "edit",
      label: "Edit",
    },
    {
      value: "view",
      label: "View",
    },
  ];

  type permission = "edit" | "view";
  type usersAccess = {
    userId: string;
    accessId: string;
    username: string;
    email: string;
    avatar: string;
    permission: permission;
  };

  const [documentVisibility, setDocumentVisibility] = useState("closed");
  const [usersAccess, setUsersAccess] = useState<usersAccess[]>([]);
  const [doc, setDoc] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>();
  const [addMember, setAddMember] = useState<string>("");
  const [myAccessPermission, setMyAccessPermission] = useState<any>();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  const handleCopyLink = () => {
    const link = `${process.env.NEXT_PUBLIC_CLIENT_URL}/${documentId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied to clipboard",
        });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${documentId}?populate[accesses][populate][0]=user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setDoc(res.data.data);
          setDocumentVisibility(res.data.data.visibility);

          const usersAccess = res.data.data.accesses.map((access: any) => {
            return {
              userId: access.user.documentId,
              accessId: access.documentId,
              username: access.user.username,
              email: access.user.email,
              avatar: access?.user?.avatar || "/avatars/shadcn.jpg",
              permission: access.permission,
            };
          });

          setUsersAccess(usersAccess);

          const findMyAccess = res.data.data.accesses.find(
            (access: any) => access?.user?.email === user?.email
          );
          setMyAccessPermission(findMyAccess?.permission || "view");
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Unable to access document.",
            description: err?.response?.data?.message || err?.message,
          });
        });
    }
  }, [documentId, user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setAllUsers(res.data);
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to fetch users.",
            description: err.response.data.message,
          });
        });
    }
  }, []);

  const handleAddUser = (userId: string) => {
    if (typeof window !== "undefined") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/accesses?populate=user`,
          {
            data: {
              doc: documentId,
              permission: "view",
              user: userId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setUsersAccess([
            ...usersAccess,
            {
              userId: res.data.data.user.documentId,
              accessId: res.data.data.documentId,
              username: res.data.data.user.username,
              email: res.data.data.user.email,
              avatar: res.data.data.user?.avatar || "/avatars/shadcn.jpg",
              permission: res.data.data.permission,
            },
          ]);
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to add user to document",
            description: err.response.data.message,
          });
        });
    }
  };

  const isUserInAccessList = (email: string) => {
    return usersAccess.some((user) => user.email === email);
  };

  const handleDocumentAccessChange = (visibility: string) => {
    if (typeof window !== "undefined") {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${documentId}`,
          {
            data: {
              visibility,
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
            title: "Document access updated",
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to update document access",
            description: err.response.data.message,
          });
        });
    }
  };

  const handleAccessDelete = (accessId: string, userId: string) => {
    if (userId === user.documentId) {
      toast({
        variant: "destructive",
        title: "You cannot remove yourself from the document",
      });
      return;
    }

    if (typeof window !== "undefined") {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/accesses/${accessId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setUsersAccess(
            usersAccess.filter(
              (user) => user.accessId !== usersAccess[0].accessId
            )
          );
          toast({
            title: "Access removed",
          });
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to remove access",
            description: "Please try again later",
          });
        });
    }
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
              <Command>
                <CommandInput
                  placeholder="user@gmail.com"
                  value={addMember}
                  onChangeCapture={(e: any) => setAddMember(e.target?.value)}
                />
                <CommandList>
                  {addMember && <CommandEmpty>No user found.</CommandEmpty>}
                  <CommandGroup>
                    {addMember &&
                      allUsers &&
                      allUsers
                        .filter(
                          (user: any) =>
                            user.email.includes(addMember) &&
                            !isUserInAccessList(user.email)
                        )
                        .map((user: any) => (
                          <CommandItem
                            key={user.email}
                            value={user.email}
                            onSelect={(currentValue) => {
                              setAddMember("");
                              handleAddUser(user.documentId);
                            }}
                          >
                            {user.email}
                            <Check
                              className={cn(
                                "ml-auto",
                                addMember === user.email
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            <Separator orientation="horizontal" />

            <div className=" flex flex-col gap-2">
              {usersAccess &&
                usersAccess.map((user, index) => (
                  <div
                    key={index}
                    className=" flex justify-between w-full gap-4"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.avatar || ""}
                          alt={user?.username}
                        />
                        <AvatarFallback className="rounded-lg uppercase">
                          {user?.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.username}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>

                    <div className=" w-48 flex gap-2 items-center">
                      <ComboboxDemo2
                        userId={user.userId}
                        accessId={user.accessId}
                        permission={user.permission}
                        permissionChoices={permissionChoices}
                        myAccessPermission={myAccessPermission}
                        setMyAccessPermission={setMyAccessPermission}
                        setUsersAccess={setUsersAccess}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className=" border rounded-sm  p-1.5 hover:cursor-pointer group">
                            <Trash2 className="size-5  group-hover:text-red-500" />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {user?.username} access from the
                              document.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                handleAccessDelete(user.accessId, user.userId);
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                    value={documentVisibility}
                    onValueChange={(val) => {
                      if (myAccessPermission === "view") {
                        toast({
                          variant: "destructive",
                          title:
                            "You do not have permission to update document access",
                        });
                        return;
                      }

                      setDocumentVisibility(val);
                      handleDocumentAccessChange(val);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    {
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    }
                  </Select>
                  <p className=" text-sm px-2">
                    {documentVisibility === "open"
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
