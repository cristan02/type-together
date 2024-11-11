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
import { Editor } from "@/components/editor";
import { Share } from "@/components/share";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const Document = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [starred, setStarred] = useState(false);

  const id = params.id;
  if (!id) {
    return null;
  }

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setTitle(res.data.data.title || "Untitled document");
        setLoading(false);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Failed to load document.",
          description: err.response.data.message,
        });

        router.back();
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/starred/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStarred(res.data);
      })
      .catch((err) => {});
  }, [id]);

  const debounce = (func: Function, delay: number) => {
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
      axios
        .put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${id}`,
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
    }, 2000),
    [id, toast]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateTitle(e.target.value);
  };

  const handleStarred = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/starred`,
        { documentId: id, starred: !starred },
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
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-col sm:flex-row h-32 sm:h-16 shrink-0 justify-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-5" />
            <div className=" p-1 cursor-pointer" onClick={handleStarred}>
              <Star
                className={` ml-auto size-5 ${
                  starred && "fill-yellow-200"
                }  text-gray-700`}
              />
            </div>
            <Input
              id="title"
              type="text"
              className=" text-lg font-semibold tracking-wider max-w-52 lg:max-w-xs w-fit active:outline-none focus:outline-none"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="flex items-center justify-between gap-2 px-4">
            <div className=" p-2 bg-secondary rounded-lg flex justify-center items-center hover:bg-secondary/80 hover:shadow-sm">
              <MessageSquareText className=" ml-auto size-5" />
            </div>

            <Separator orientation="vertical" className="mr-2 h-5" />

            <div className=" p-2 bg-secondary rounded-lg flex justify-center items-center hover:bg-secondary/80 hover:shadow-sm">
              <PhoneCall className=" ml-auto size-5" />
            </div>

            <Separator orientation="vertical" className="mr-2 h-5" />

            <div className=" p-2 bg-sky-100 dark:bg-sky-500 rounded-lg flex justify-center items-center hover:bg-sky-200 dark:hover:bg-sky-600 hover:shadow-sm">
              <Share />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <Editor id={id} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export { Document };
