import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/site/AuthShell";
import { LoginForm } from "@/components/site/AuthForms";

export const metadata: Metadata = { title: "Log in" };
export default function Login() {
  return (
    <AuthShell title="Welcome back" sub="Log in to your Stampwala dashboard." foot={<>New here? <Link href="/signup" className="font-bold text-leaf">Create a free account</Link></>}>
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
