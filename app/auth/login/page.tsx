// app/auth/login/page.tsx
import { redirect } from "next/navigation";
export const metadata = { title: "Login — SOR7ED" };
export default function LoginPage() {
	redirect("/signup?mode=login");
}
