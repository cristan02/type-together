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
import { data } from "@/lib/data/getting-started";
import Delta from "quill-delta";
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

const HISTORY = {
  delay: 2000,
  maxStack: 500,
  userOnly: true,
};

const Editor = ({
  documentId,
  enableEdits,
  setEnableEdits,
  socket,
  enableView,
  setEnableView,
}: {
  documentId: string;
  enableEdits: boolean;
  setEnableEdits: any;
  socket: any;
  enableView: boolean;
  setEnableView: any;
}) => {
  const quillRef = useRef<any>();
  const [content, setContent] = useState("");
  const [snapshot, setSnapshot] = useState<any>();

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

  useEffect(() => {
    async function postRecentDocument() {
      if (typeof window !== "undefined" && documentId !== "getting-started") {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/recents`,
            {
              documentId: documentId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {})
          .catch((err) => {});
      }
    }

    postRecentDocument();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const editor = quillRef.current.getEditor();
      editor.disable();
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      user &&
      documentId != "getting-started" &&
      socket
    ) {
      const editor = quillRef.current.getEditor();

      const timer = setInterval(() => {
        socket.emit("save-document", {
          snapshotId: snapshot?.documentId,
          content: editor.getContents(),
        });
      }, 3000);

      editor.disable();
      editor.setText("");
      socket.emit("get-document", documentId);

      // load document
      const loadDocument = (snapshot: any) => {
        setSnapshot(snapshot);
        editor.setContents(new Delta());
        editor.setContents(snapshot.content);

        if (enableEdits) {
          editor.enable();
        }
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
        if (quillRef.current == null || documentId !== receivedId) return;
        editor?.updateContents(delta);
      };
      socket.on("receive-changes", updateChangesWithDelta);

      socket.on("recieve-restore", loadDocument);

      const updateCursorPosition = (data: any, receivedId: any) => {
        const { range, user } = data;
        if (quillRef.current == null || documentId !== receivedId) return;
        const editor = quillRef.current.getEditor();
        const cursors = editor.getModule("cursors");
        cursors.createCursor(
          user?.id,
          `User ${user?.username}`,
          COLORS[Math.floor(Math.random() * COLORS.length)]
        );
        cursors.moveCursor(user?.id, range);
      };
      socket.on("receive-cursor", updateCursorPosition);

      socket.on("disconnect", () => {
        socket.emit("save-document", {
          snapshotId: snapshot?.documentId,
          content: editor.getContents(),
        });
        editor.disable();
      });

      return () => {
        clearInterval(timer);
        socket.off("receive-changes", updateChangesWithDelta);
        socket.off("recieve-restore", loadDocument);
        socket.off("receive-cursor", updateCursorPosition);
        socket.off("disconnect");
        socket.disconnect();
      };
    }
  }, [user]);

  const changeHandler = (newContent: any, delta: any, source: any) => {
    setContent(newContent);
    if (socket == null) return;
    if (source !== "user") return;

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      socket.emit("send-changes", { delta, snapshotId: snapshot?.id, content });
      socket.emit("send-cursor", { range, user });
    }
  };

  useEffect(() => {
    if (documentId === "getting-started" && quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.disable();
      editor.setContents(data);
    }
  }, [documentId, quillRef]);

  return (
    <ReactQuill
      theme="snow"
      value={content}
      onChange={changeHandler}
      modules={{ toolbar: TOOLBAR_OPTIONS, cursors: true, history: HISTORY }}
      ref={(node) => {
        quillRef.current = node;
      }}
      className="w-full bg-background rounded-md "
    />
  );
};

export default Editor;
