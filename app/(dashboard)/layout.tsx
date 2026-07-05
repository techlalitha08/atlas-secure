import { Sidebar } from "@/components/layout/sidebar";
import { FloatingAssistant } from "@/components/layout/floating-assistant";
import { TrustProvider } from "@/lib/trust-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrustProvider>
      <div className="mesh-bg min-h-screen">
        <Sidebar />
        <div className="pl-[260px] min-h-screen transition-all duration-300">
          {children}
        </div>
        <FloatingAssistant />
      </div>
    </TrustProvider>
  );
}
