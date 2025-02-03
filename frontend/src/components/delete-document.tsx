"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const DeleteDocument = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { documentId } = useParams();

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      axios
        .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/docs/${documentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          router.push("/getting-started");
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred.",
          });
        });
    }
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

export { DeleteDocument };
