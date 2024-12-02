import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/Assets/Images/logo_dark.svg";

export function CustomSpinner({ className }) {
  return (
    <Image
      className={cn("animate-pulse size-24", className)}
      src={logo}
      alt="Loading..."
    />
  );
}
