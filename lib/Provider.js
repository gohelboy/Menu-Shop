"use client";

import { CustomSpinner } from "@/components/ui/custom-spinner";
import { ClerkProvider, useUser } from "@clerk/nextjs";

export default function Providers({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <RenderApp>{children}</RenderApp>
    </ClerkProvider>
  );
}

const RenderApp = ({ children }) => {
  const { isLoaded } = useUser();

  return isLoaded ? (
    <>{children}</> 
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <CustomSpinner />
    </div>
  );
};
