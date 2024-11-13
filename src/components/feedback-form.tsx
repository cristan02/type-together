"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ComboboxDemo } from "@/components/ui/ComboboxDemo";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export function FeedbackForm() {
  const { toast } = useToast();

  const data = [
    {
      value: "feedback",
      label: "Feedback",
    },
    {
      value: "suggestion",
      label: "Suggestion",
    },
    {
      value: "report-bug",
      label: "Report Bug",
    },
    {
      value: "feature-request",
      label: "Feature request",
    },
  ];
  const [type, setValue] = useState(data[0].value);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedbacks`,
          {
            data: {
              type,
              message,
            },
          },
          {
            headers: {
              Authorization: localStorage.getItem("token")
                ? `Bearer ${localStorage.getItem("token")}`
                : "",
            },
          }
        )
        .then(() => {
          toast({ title: "Tankyou for you Feedback" });
          setMessage("");
          setValue(data[0].value);
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try again later",
          });
        });
    }
  };

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Feedback</CardTitle>
        <CardDescription>
          We would love to hear your thoughts on our product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Type</Label>
              <ComboboxDemo data={data} value={type} setValue={setValue} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="message">Message</Label>
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here. "
                className=" max-h-36"
              />
            </div>

            <Button
              type="submit"
              className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
