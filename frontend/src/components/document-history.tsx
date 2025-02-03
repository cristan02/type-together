"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ReactQuill, { Quill } from "react-quill-new";
import Delta from "quill-delta";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { RotateCcw } from "lucide-react";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const DocumentHistory = ({
  socket,
  setOpen,
}: {
  socket: any;
  setOpen: any;
}) => {
  const { toast } = useToast();
  const quillRef = useRef<any>();
  const [snapshots, setSnapshots] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/snapshots?populate=deltas&sort[0]=updatedAt:desc&pagination[page]=1&pagination[pageSize]=100`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setSnapshots(res.data.data);
          setSelectedSnapshot(res.data.data[0]);
          if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            // i want to clear the editor contents and set this
            editor.setContents(new Delta());
            editor.setContents(res.data.data[0].content);
          }
        })
        .catch((err) => {
          toast({
            title: "Unable to load document history",
            description: "Please try again later",
          });
        });
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleRestore = () => {
    if (socket == null) return;

    socket.emit("send-restore", { content: selectedSnapshot.content });
    setOpen(false);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <div className=" grid sm:grid-cols-4 gap-4 overflow-auto">
      <div className=" sm:col-span-3">
        <ReactQuill
          theme="snow"
          modules={{ toolbar: TOOLBAR_OPTIONS }}
          ref={(node) => {
            quillRef.current = node;
          }}
          className="w-full bg-background rounded-md "
        />
      </div>

      <div className=" flex flex-col gap-2 divide-y overflow-auto ">
        <div className=" font-bold flex gap-4 justify-between items-center text-lg">
          History
          {selectedSnapshot &&
            selectedSnapshot?.documentId !== snapshots[0]?.documentId && (
              <Button type="submit" className="w-fit" onClick={handleRestore}>
                Restore
              </Button>
            )}
        </div>
        {snapshots.map((snapshot: any) => (
          <div
            key={snapshot.id}
            className=" flex flex-col gap-2 hover:bg-gray-50 p-1"
            onClick={() => {
              if (quillRef.current) {
                const editor = quillRef.current.getEditor();
                editor.setContents(snapshot.content);
                setSelectedSnapshot(snapshot);
              }
            }}
          >
            <div>{formatDate(snapshot.updatedAt)}</div>
            <div className=" flex gap-2 items-center">
              <div className=" w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className=" text-sm">{snapshot?.deltas?.length} changes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentHistory;
