"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquareText, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Message {
  user: {
    documentId: string;
    username: string;
    email: string;
    avatar: string;
  };
  message: string;
  timestamp: Date;
}

export function Chat({
  messages,
  message,
  setMessage,
  handleSendMessage,
  unread,
  setUnread,
}: {
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  unread: boolean;
  setUnread: (unread: boolean) => void;
}) {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  return (
    <Sheet
      onOpenChange={() => {
        setUnread(false);
      }}
    >
      <SheetTrigger asChild>
        <div className=" relative">
          {unread && (
            <div className=" absolute right-0 h-2 w-2 rounded-full bg-red-500"></div>
          )}
          <MessageSquareText className=" ml-auto size-5" />
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader>
          <SheetTitle>Chat</SheetTitle>
          <SheetDescription>Chat with your team members</SheetDescription>
        </SheetHeader>

        <div className=" flex h-full flex-col py-4 pb-8 gap-4 ">
          <div className=" h-full">
            {messages.map((message, index) => (
              <div className=" " key={index}>
                {message.user.documentId !== user?.documentId ? (
                  <div className=" flex gap-2 mb-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-10 w-10 rounded-full cursor-default select-none">
                            <AvatarImage
                              src={user?.avatar || ""}
                              alt={user?.username}
                            />
                            <AvatarFallback className="rounded-lg uppercase p-2 bg-sky-100 dark:text-black">
                              {user?.username.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.username}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className=" flex flex-col max-w-[70%]">
                      <div className=" rounded-lg rounded-tl-none bg-sky-100 p-2 dark:text-black">
                        {message.message}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className=" flex gap-2 w-full justify-end mb-2">
                    <div className=" flex flex-col max-w-[70%]">
                      <div className=" rounded-lg rounded-br-none bg-gray-100 p-2 dark:text-black">
                        {message.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className=" flex gap-2">
            <Input
              id="message"
              type="text"
              className="w-full"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              onClick={() => {
                if (message.trim() === "") return;

                handleSendMessage();
              }}
            >
              <Send className=" size-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
