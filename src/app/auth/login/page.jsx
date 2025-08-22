import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";

export const metadata = {
  title: "Login | Dashboard",
  description: "Halaman login user",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/common/home");
  }

  return <LoginForm />;
}
