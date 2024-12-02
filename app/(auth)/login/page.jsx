"use client";

import logo from "@/Assets/Images/logo.svg";
import AuthSideSection from "@/components/custom/AuthSideSection";
import { Button } from "@/components/ui/button";
import { CustomSpinner } from "@/components/ui/custom-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { useSignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  const { signIn, setActive } = useSignIn();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, router, isSignedIn]);

  // Formik setup with validation schema
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const response = await signIn.create({
          identifier: email,
          password,
        });

        await setActive({ session: response.createdSessionId });

        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        router.push("/dashboard");
      } catch (err) {
        console.log("Error:", err);
        toast({
          title: "Error",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  if (isSignedIn)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );

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
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="bg-gray-50"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className="bg-gray-50"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              {formik.isSubmitting ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Log in"
              )}
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
                Sign in with Google
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => router.push("/register")}
              className="text-gray-500"
            >
              Don't have an account? Register
            </Button>
          </div>
        </div>
        {/* Right side: AI Menu Showcase */}
        <AuthSideSection />
      </div>
    </div>
  );
}
