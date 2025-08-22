import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Forms/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    redirect("/common/home");
  }

  return <LoginForm />;
}
