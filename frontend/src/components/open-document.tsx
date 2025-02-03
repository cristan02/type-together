"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const OpenDocument = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState<any>({});

  const [user, setUser] = useState<any>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);

      if (user) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            setDocuments(res.data.data);
          })
          .catch((err) => {
            toast({
              variant: "destructive",
              title: "Failed to fetch documents.",
              description: err.response.data.message,
            });
          });
      }
    }
  }, []);

  const handleOpen = async () => {
    if (!selectedDocument?.documentId) {
      toast({
        variant: "destructive",
        title: "Document not selected.",
        description: "Please select a document to open.",
      });
      return;
    }

    router.push(`/${selectedDocument.documentId}`);
  };

  return (
    <div className=" flex flex-col gap-6 ">
      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc: any, idx) => (
          <div
            key={idx}
            className={`border p-2 rounded ${
              selectedDocument?.id === doc?.id && "border-blue-500"
            }`}
            onClick={() => {
              if (selectedDocument?.id === doc?.id) {
                setSelectedDocument({});
              } else {
                setSelectedDocument(doc);
              }
            }}
          >
            <Label>{doc?.title}</Label>
          </div>
        ))}
      </div>
      {selectedDocument?.id && (
        <Button
          type="button"
          onClick={handleOpen}
          className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600  text-white"
        >
          Open
        </Button>
      )}
    </div>
  );
};

export { OpenDocument };
