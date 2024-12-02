"use client";

import { CustomSpinner } from "@/components/ui/custom-spinner";
import { ClerkProvider, useUser } from "@clerk/nextjs";

export default function Providers({ children }) {
  return (
    <ClerkProvider>
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
