import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/site/AuthShell";
import { SignupForm } from "@/components/site/AuthForms";

export const metadata: Metadata = { title: "Start free" };
export default function Signup() {
  return (
    <AuthShell title="Start free" sub="Your loyalty program will be live in about ten minutes." foot={<>Already have an account? <Link href="/login" className="font-bold text-leaf">Log in</Link></>}>
      <Suspense><SignupForm /></Suspense>
    </AuthShell>
  );
}
