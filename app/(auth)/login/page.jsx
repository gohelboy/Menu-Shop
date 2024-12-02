"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Scan } from "lucide-react";
import logo from "@/Assets/Images/logo.svg";
import chef from "@/Assets/Images/chef_login.webp";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { CustomSpinner } from "@/components/ui/custom-spinner";

export default function LoginPage() {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, router, isSignedIn]);

  if (isSignedIn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const response = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: response.createdSessionId });

      toast({
        title: "Error",
        description: "Loggedin",
      });

      router.push("/dashboard");
    } catch (err) {
      console.log("error", err);
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-5xl w-full flex shadow-2xl overflow-hidden rounded-2xl">
        {/* Left side: Login form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r p-3 from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src={logo} alt="Logo" width={48} height={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Menu Shop</h1>
            <p className="text-sm text-gray-600 mt-2">AI-Powered Menu Magic</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-50"
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              {isLoading ? <Spinner color="white" size="sm" /> : "Log in"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                {/* <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.1 0 5.5 1.3 7 2.4l5.3-5.3C32.7 4 28.8 2.5 24 2.5 14.6 2.5 6.6 8.5 3 17.5l6.8 5.3C11.5 15 17 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M9.8 22.8c0-1.3.2-2.6.6-3.7L3 13.5C1.1 17 0 20.8 0 24c0 3.1 1 6.3 2.8 9l6.8-5.3c-.7-1.3-1.1-2.7-1.1-4.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 39.5c-6.1 0-11.6-4.6-12.9-10.8L4.3 34.8c3.6 6.3 10.4 10.7 19.7 10.7 5.4 0 10.4-1.9 14.2-5.5l-6.8-5.3c-1.5 1.4-4.2 2.3-7.4 2.3z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.6 24.5c0-1.8-.3-3.6-.8-5.3H24v10.1h12.6c-1.7 3.8-5 6.5-9.1 6.5-.3 0-.6 0-.9-.1l6.8 5.3c1.9-1.7 3.4-3.9 4.3-6.7 1.2-2.7 1.8-5.6 1.8-8.8z"
                  />
                </svg> */}
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
        {/* Right side: AI Menu Showcase */}
        <div className="hidden md:block md:w-1/2 bg-gray-900 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-800 opacity-90"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="text-white space-y-6">
              <h2 className="text-3xl font-bold">Transform Menus with AI</h2>
              <p className="text-lg">
                Upload, scan, and generate stunning menu designs in seconds
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <Scan className="w-8 h-8 text-purple-300 mb-2" />
                <h3 className="text-white font-semibold mb-1">
                  Smart Scanning
                </h3>
                <p className="text-purple-200 text-sm">
                  Instantly digitize your existing menus
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <ImageIcon className="w-8 h-8 text-indigo-300 mb-2" />
                <h3 className="text-white font-semibold mb-1">AI Generation</h3>
                <p className="text-indigo-200 text-sm">
                  Create unique menu items with AI
                </p>
              </div>
            </div>
            <div className="mt-8">
              <div className="relative">
                <Image
                  src={chef}
                  alt="AI-generated menu sample"
                  width={460}
                  height={200}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
