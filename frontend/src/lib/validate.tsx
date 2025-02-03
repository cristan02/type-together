"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function Validate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const validateUser = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null;

      if (user) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            if (
              user.documentId !== res.data.documentId ||
              user.id !== res.data.id ||
              user.username !== res.data.username ||
              user.email !== res.data.email
            ) {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              router.push("/login");
            }
          })
          .catch((err) => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/login");
          });
      }
    }
  };

  useEffect(() => {
    validateUser();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token") {
        validateUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
