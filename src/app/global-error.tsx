"use client";

import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html>
      <body>
        <div className=" h-screen w-full flex flex-col justify-center items-center gap-4">
          <h2 className=" text-xl font-semibold">Something went wrong!</h2>
          <button
            className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
              }
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
