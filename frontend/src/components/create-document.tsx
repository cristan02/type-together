"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateDocument = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      toast({
        variant: "destructive",
        title: "Title is required.",
        description: "Please enter a title.",
      });
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/docs`,
        {
          data: {
            title,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        router.push(`/${res.data.data.documentId}`);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Failed to create document.",
          description: err.response.data.message,
        });
      });
  };

  return (
    <form onSubmit={handleCreate}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="title"
            placeholder="Document title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600  text-white"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export { CreateDocument };
