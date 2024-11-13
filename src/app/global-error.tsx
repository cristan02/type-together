"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
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
                reset();
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
