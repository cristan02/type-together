"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const DocumentHistory = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
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
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/doc`)
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <form onSubmit={handleDelete}>
      <div className="grid ">
        <h3 className=" font-semibold ">Are you absolutely sure</h3>

        <p className=" mt-2">
          This action cannot be undone. This will permanently delete your
          document from our servers.
        </p>

        <div className=" flex justify-end mt-4">
          <Button
            type="submit"
            className="w-fit tracking-wider font-semibold bg-red-500 hover:bg-red-600  text-white px-4"
          >
            Delete
          </Button>
        </div>
      </div>
    </form>
  );
};

export { DocumentHistory };
