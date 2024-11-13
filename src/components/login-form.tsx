"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaGithub } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email) {
      toast({
        variant: "destructive",
        title: "Email is required.",
        description: "Please enter an email.",
      });
      return;
    } else if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email format.",
        description: "Please enter a valid email.",
      });
      return;
    } else if (!password) {
      toast({
        variant: "destructive",
        title: "Password is required.",
        description: "Please enter a password.",
      });
      return;
    }

    if (typeof window !== "undefined") {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/local`, {
          identifier: email,
          password,
        })
        .then((res) => {
          if (res.data?.user) {
            localStorage.setItem("token", res.data?.jwt);
            localStorage.setItem("user", JSON.stringify(res.data?.user));

            router.push("/getting-started");
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Invalid credentials.",
            description: "Please check your email and password and try again.",
          });
        });
    }
  };

  const handleGithubLogin = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600  text-white"
            >
              Login
            </Button>

            <div className=" w-full flex flex-col items-center justify-center relative">
              <div className=" z-10 px-2 bg-card w-fit text-card-foreground">
                OR
              </div>
              <div className=" z-0 -translate-y-3 flex justify-center border-t border-gray-300 w-full" />
            </div>

            {/* <Button className="w-full tracking-wider font-semibold flex items-center gap-2 bg-blue-700 hover:bg-blue-600  text-white">
              <FaGoogle />
              Login with Google
            </Button> */}
            <Button
              onClick={handleGithubLogin}
              className="w-full tracking-wider font-semibold flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <FaGithub /> Login with Github
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
