"use client";

import logo from "@/Assets/Images/logo.svg";
import AuthSideSection from "@/components/custom/AuthSideSection";
import { Button } from "@/components/ui/button";
import { CustomSpinner } from "@/components/ui/custom-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export default function Register() {
  const { signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, router, isSignedIn]);

  const handleSubmit = async (values) => {
    if (!isLoaded) return;
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);

      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code.",
        variant: "default",
      });
    } catch (err) {
      console.log("Registration Error:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration";

      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

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
        title: "Google Sign Up Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        toast({
          title: "Verification Successful",
          description: "Welcome to Menu Shop!",
          variant: "default",
        });

        router.push("/dashboard");
      } else {
        toast({
          title: "Verification Failed",
          description: "Unable to complete verification. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during verification";

      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-5xl w-full flex shadow-2xl overflow-hidden rounded-2xl">
          <div className="w-full md:w-1/2 bg-white p-8">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r p-3 from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image src={logo} alt="Logo" width={48} height={48} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Menu Shop</h1>
              <p className="text-sm text-gray-600 mt-2">
                AI-Powered Menu Magic
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Verify your email
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please enter the verification code sent to your email.
            </p>
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="bg-gray-50"
                  placeholder="Enter your code"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </div>
          <AuthSideSection />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-5xl w-full flex shadow-2xl overflow-hidden rounded-2xl">
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
                {...formik.getFieldProps("email")}
                required
                className="bg-gray-50"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                required
                className="bg-gray-50"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? "Registering..." : "Register"}
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
                variant="outline"
                onClick={signUpWithGoogle}
                className="w-full flex items-center justify-center"
              >
                Sign Up with Google
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="text-gray-500"
              >
                Already have an account? Login
              </Button>
            </div>
          </div>
        </div>
        <AuthSideSection />
      </div>
    </div>
  );
}
