"use client";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/contexts/UserContext";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const user = useUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <Sidebar user={user}>
      <div className="container">
        <div className="p-6 flex-1">{children}</div>
      </div>
    </Sidebar>
  );
}
