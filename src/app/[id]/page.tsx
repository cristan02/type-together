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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (!id) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-col sm:flex-row h-32 sm:h-16 shrink-0 justify-center sm:justify-between gap-2 w-full">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-5" />
            <div className=" p-1">
              <Star className=" ml-auto size-5 fill-yellow-200 text-gray-700" />
            </div>
            <Input
              id="title"
              type="text"
              className=" text-lg font-semibold tracking-wider max-w-52 lg:max-w-xs w-fit active:outline-none focus:outline-none"
              defaultValue="Document name"
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
}
