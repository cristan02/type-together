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

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!username) {
      toast({
        variant: "destructive",
        title: "Username is required.",
        description: "Please enter a username.",
      });
      return;
    } else if (!email) {
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
    } else if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password is too short.",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (typeof window !== "undefined") {
      await axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/local/register`, {
          username,
          email,
          password,
        })
        .then((res) => {
          if (res.data?.user) {
            const user = res.data.user;
            localStorage.setItem("token", res.data.jwt);
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/getting-started");
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        });
    }
  };

  const handleGithubLogin = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>
          Enter your email below to signup for an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600 text-white"
            >
              Sign up
            </Button>

            {/* <div className=" w-full flex flex-col items-center justify-center relative">
              <div className=" z-10 px-2 bg-card w-fit text-card-foreground">
                OR
              </div>
              <div className=" z-0 -translate-y-3 flex justify-center border-t border-gray-300 w-full" />
            </div> */}

            {/* <Button className="w-full tracking-wider font-semibold flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white">
            <FaGoogle />
            Signup with Google
          </Button> */}
            {/* <Button
              onClick={handleGithubLogin}
              className="w-full tracking-wider font-semibold flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <FaGithub />
              Signup with Github
            </Button> */}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
