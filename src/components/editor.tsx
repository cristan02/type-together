"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import socket from "socket.io-client";

const Editor = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [value, setValue] = useState<any>(null);
  const quillRef = useRef<any>(null);

  const io = socket(process.env.NEXT_PUBLIC_BASE_URL);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image"],

      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res?.data?.data?.snapshots?.length > 0) {
          setValue(
            res.data.data.snapshots[res.data.data.snapshots.length - 1].content
          );
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Failed to create document.",
          description: err.response.data.message,
        });

        // router.back();
      });
  }, [id]);

  useEffect(() => {
    io.emit("joinRoom", id);

    io.on("receiveChanges", async (data, error) => {
      console.log("data ", data);
      setValue(data);
    });

    return () => {
      io.emit("leaveRoom", id);
    };
  }, [id]);

  const handleEditorChange = (
    content: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    if (delta !== value) {
      io.emit(
        "documentEdit",
        { documentId: id, delta: content },
        (error: any) => {}
      );
    }
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      modules={quillModules}
      // formats={quillFormats}
      value={value}
      onChange={handleEditorChange}
      className="w-full bg-background rounded-md "
    />
  );
};

export { Editor };
