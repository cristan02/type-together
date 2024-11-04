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

export function FeedbackForm() {
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
  const [value, setValue] = useState(data[0].value);

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Feedback</CardTitle>
        <CardDescription>
          We would love to hear your thoughts on our product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Type</Label>
            <ComboboxDemo data={data} value={value} setValue={setValue} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="message">Message</Label>
            </div>
            <Textarea
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
      </CardContent>
    </Card>
  );
}
