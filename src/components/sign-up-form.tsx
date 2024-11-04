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

export function SignUpForm() {
  return (
    <Card className="mx-auto max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>
          Enter your email below to signup for an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
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
            <Input id="password" type="password" required />
          </div>
          <Button
            type="submit"
            className="w-full tracking-wider font-semibold bg-blue-700 hover:bg-blue-600 text-white"
          >
            Sign up
          </Button>

          <div className=" w-full flex flex-col items-center justify-center relative">
            <div className=" z-10 px-2 bg-card w-fit text-card-foreground">
              OR
            </div>
            <div className=" z-0 -translate-y-3 flex justify-center border-t border-gray-300 w-full" />
          </div>

          <Button className="w-full tracking-wider font-semibold flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white">
            <FaGoogle />
            Signup with Google
          </Button>
          <Button className="w-full tracking-wider font-semibold flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white">
            <FaGithub />
            Signup with Github
          </Button>
        </div>
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
