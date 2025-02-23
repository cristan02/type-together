"use client";
import { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { MessageSquareShare, Headset } from "lucide-react";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

export default function Page() {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      setUser(user);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div
          className={` text-5xl font-extrabold capitalize tracking-wide w-full italic ${montserrat.className} `}
        >
          <div className=" drop-shadow-md ">Type</div>
          <div className=" drop-shadow-md">Together</div>
        </div>

        <ol className="list-inside list-decimal text-sm text-center italic sm:text-left ">
          <li className="mb-2">
            Get started by signing up{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              <Link href={`/sign-up`}>here</Link>
            </code>
            .
          </li>
          <li>Create a document and start editing.</li>
        </ol>

        {user ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
              }}
            >
              Logout
            </button>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="/getting-started"
            >
              Getting started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/feedback"
        >
          <MessageSquareShare />
          Feedback
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/support"
        >
          <Headset />
          Get support →
        </Link>
      </footer>
    </div>
  );
}
