"use client";
import { useState, useEffect, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MessageSquareText, PhoneCall, Star } from "lucide-react";
import { Share } from "@/components/share";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Chat } from "@/components/chat";
import { Message } from "@/components/chat";
import io from "socket.io-client";

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.default),
  {
    loading: () => <p>Loading...</p>,
  }
);

const Document = ({ params }: { params: { documentId: string } }) => {
  const [title, setTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [starred, setStarred] = useState(false);
  const [doc, setDoc] = useState<any>(null);

  const [enableEdits, setEnableEdits] = useState(false);
  const documentId = params.documentId;

  const { toast } = useToast();
  const router = useRouter();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (documentId === "getting-started") {
      setTitle("Getting Started");
      setDoc(true);
    } else if (typeof window !== "undefined") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${documentId}?populate[accesses][populate][0]=user`,
          {
            headers: {
              Authorization: localStorage.getItem("token")
                ? `Bearer ${localStorage.getItem("token")}`
                : "",
            },
          }
        )
        .then((res) => {
          setDoc(res.data.data);
          setTitle(res.data.data.title || "Untitled document");

          if (res.data.data.visibility === "open") {
            setEnableEdits(true);
          }
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to load document.",
            description: "Please try again later.",
          });

          router.back();
        });

      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/starred/${documentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setStarred(res.data);
        })
        .catch((err) => {});
    }
  }, [documentId, user]);

  useEffect(() => {
    if (user && doc && documentId !== "getting-started") {
      if (
        doc.accesses.some(
          (access: any) => access.user.documentId === user.documentId
        )
      ) {
        setEnableEdits(true);
      }
    }
  }, [user, doc]);

  const debounce = (func: any, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const updateTitle = useCallback(
    debounce((newTitle: string) => {
      if (typeof window !== "undefined") {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${documentId}`,
            { data: { title: newTitle } },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {})
          .catch((err) => {
            toast({
              variant: "destructive",
              title: "Failed to update title.",
              description: err.response.data.message,
            });
          });
      }
    }, 2000),
    [documentId, toast]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    if (!enableEdits) return;

    setTitle(e.target.value);
    updateTitle(e.target.value);
  };

  const handleStarred = () => {
    if (typeof window !== "undefined") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/starred`,
          { documentId: documentId, starred: !starred },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setStarred(!starred);
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Failed to update starred status.",
            description: err.response.data.message,
          });
        });
    }
  };

  useEffect(() => {
    if (doc) {
      setLoading(false);
    }
  }, [doc]);

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
        extraHeaders: {
          userid: user?.id,
          username: user?.username,
          auth: localStorage.getItem("token") || "",
        },
      });

      setSocket(socket);

      const handleMessages = (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      socket.emit("chat-room", documentId);
      socket.on("receive-message", handleMessages);

      return () => {
        socket.off("receive-message", handleMessages);
        socket.disconnect();
      };
    }
  }, [user]);

  const handleSendMessage = () => {
    if (socket == null) return;
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      user: user,
      message: message,
      timestamp: new Date(),
    };

    socket.emit("send-message", newMessage);
    setMessage("");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <SidebarProvider>
      {user && (
        <AppSidebar enableEdits={enableEdits} setEnableEdits={setEnableEdits} />
      )}
      <SidebarInset>
        <header className="flex flex-col sm:flex-row h-32 sm:h-16 shrink-0 justify-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 px-4 w-full">
            {enableEdits && <SidebarTrigger className="-ml-1" />}
            {enableEdits && (
              <Separator orientation="vertical" className="mr-2 h-5" />
            )}
            {enableEdits && (
              <div className=" p-1 cursor-pointer" onClick={handleStarred}>
                <Star
                  className={` ml-auto size-5 ${
                    starred && "fill-yellow-200"
                  }  text-gray-700`}
                />
              </div>
            )}
            <Input
              id="title"
              type="text"
              className=" text-lg font-semibold tracking-wider max-w-52 lg:max-w-xs w-fit active:outline-none focus:outline-none"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {enableEdits && (
            <div className="flex items-center justify-between gap-2 px-4">
              <div className=" p-2 bg-secondary rounded-lg flex justify-center items-center hover:bg-secondary/80 hover:shadow-sm">
                <Chat
                  messages={messages}
                  message={message}
                  setMessage={setMessage}
                  handleSendMessage={handleSendMessage}
                />
              </div>

              <Separator orientation="vertical" className="mr-2 h-5" />

              <div className=" p-2 bg-secondary rounded-lg flex justify-center items-center hover:bg-secondary/80 hover:shadow-sm">
                <PhoneCall className=" ml-auto size-5" />
              </div>

              <Separator orientation="vertical" className="mr-2 h-5" />

              <div className=" p-2 bg-sky-100 dark:bg-sky-500 rounded-lg flex justify-center items-center hover:bg-sky-200 dark:hover:bg-sky-600 hover:shadow-sm">
                <Share documentId={documentId} />
              </div>
            </div>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Editor
              documentId={documentId}
              enableEdits={enableEdits}
              setEnableEdits={setEnableEdits}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export { Document };
