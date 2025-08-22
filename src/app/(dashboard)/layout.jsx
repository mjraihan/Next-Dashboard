import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UserProvider } from "@/contexts/UserContext";

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  const user = session.user;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <UserProvider value={user}>
      <Sidebar user={user}>
        <div className="container">
          <div className="p-6 flex-1">{children}</div>
        </div>
      </Sidebar>
    </UserProvider>
  );
}
