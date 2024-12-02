import { AppSidebar } from "@/components/ui/app-sidebar";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-[calc(100vh-38px)]">
          <SidebarTrigger />
          <div className="h-full">{children}</div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
