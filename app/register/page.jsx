"use client";

import chef from "@/Assets/Images/chef_login.webp";
import logo from "@/Assets/Images/logo.svg";
import { Button } from "@/components/ui/button";
import { CustomSpinner } from "@/components/ui/custom-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useSignUp, useUser } from "@clerk/nextjs";
import { ImageIcon, Scan } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Register() {
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, router, isSignedIn]);

  if (!isSignedIn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err) {
      console.log("Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const signUpWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-5xl w-full flex shadow-2xl overflow-hidden rounded-2xl">
        {/* Left side: Registration form */}
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
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-50"
              />
            </div>
            {/* CAPTCHA Widget */}
            <div id="clerk-captcha"></div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              Register
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
                onClick={signUpWithGoogle}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                Sign up with Google
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
