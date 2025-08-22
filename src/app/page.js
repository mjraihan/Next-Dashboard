"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const session = useUser();
  const checking = true;

  useEffect(() => {
    if (session) {
      router.replace("/common/home");
    } else {
      router.replace("/auth/login");
    }
  }, [session, router]);

  return (
    <>
      {checking && (
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </>
  );
}
