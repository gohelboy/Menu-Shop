// app/protected/page.js
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomSpinner } from "./custom-spinner";

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CustomSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
