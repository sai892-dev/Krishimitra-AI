import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f8faf6]">
      <Sidebar role={profile.role} />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
          <div className="mt-4">{children}</div>
        </main>
        <MobileNav role={profile.role} />
      </div>
    </div>
  );
}
