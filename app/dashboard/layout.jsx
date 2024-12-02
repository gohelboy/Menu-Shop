import { AppSidebar } from "@/components/ui/app-sidebar";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
