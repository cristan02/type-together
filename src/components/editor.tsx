"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "@/styles/editor.css";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import QuillCursors from "quill-cursors";
Quill.register("modules/cursors", QuillCursors);

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

const COLORS = [
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "cyan",
  "magenta",
];

const Editor = ({ id }: { id: string }) => {
  const quillRef = useRef<any>();
  const [socket, setSocket] = useState<any>();
  const [content, setContent] = useState("");
  const [snapshot, setSnapshot] = useState<any>();

  const { toast } = useToast();
  const router = useRouter();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${id}?populate=*`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {})
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Failed to load document.",
          description: err.response.data.message,
        });

        router.back();
      });
  }, [id]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      extraHeaders: {
        userid: user?.id,
        username: user?.username,
        auth: localStorage.getItem("token") || "",
      },
    });

    const editor = quillRef.current.getEditor();

    const timer = setInterval(() => {
      console.log("Saving document...", editor.getContents());
      socket.emit("save-document", {
        snapshotId: snapshot?.id,
        content: editor.getContents(),
      });
    }, 3000);

    editor.disable();
    editor.setText("Loading...");
    setSocket(socket);
    socket.emit("get-document", id);

    // load document
    const loadDocument = (snapshot: any) => {
      setSnapshot(snapshot);
      editor.setContents(snapshot.content);
      editor.enable();
    };
    // once() cleans up itself when the
    socket.once("load-document", loadDocument);

    // Initialize QuillCursors
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.getModule("cursors");
    }

    // Receive changes
    const updateChangesWithDelta = (delta: any, receivedId: any) => {
      if (quillRef.current == null || id !== receivedId) return;
      editor?.updateContents(delta);
    };
    socket.on("receive-changes", updateChangesWithDelta);

    const updateCursorPosition = (data: any, receivedId: any) => {
      const { range, user } = data;
      if (quillRef.current == null || id !== receivedId) return;
      const editor = quillRef.current.getEditor();
      const cursors = editor.getModule("cursors");
      cursors.createCursor(
        user.id,
        `User ${user.username}`,
        COLORS[Math.floor(Math.random() * COLORS.length)]
      );
      cursors.moveCursor(user.id, range);
    };
    socket.on("receive-cursor", updateCursorPosition);

    socket.on("disconnect", () => {
      socket.emit("save-document", editor.getContents());
    });

    return () => {
      clearInterval(timer);
      socket.off("receive-changes", updateChangesWithDelta);
      socket.off("receive-cursor", updateCursorPosition);
      socket.disconnect();
    };
  }, []);

  const changeHandler = (newContent: any, delta: any, source: any) => {
    setContent(newContent);
    if (socket == null) return;
    if (source !== "user") return;
    console.log("Sending changes...", delta);
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      socket.emit("send-changes", { delta, snapshotId: snapshot?.id, content });
      socket.emit("send-cursor", { range, user });
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={changeHandler}
      modules={{ toolbar: TOOLBAR_OPTIONS, cursors: true }}
      ref={(node) => {
        quillRef.current = node;
      }}
      className="w-full bg-background rounded-md "
    />
  );
};

export { Editor };
