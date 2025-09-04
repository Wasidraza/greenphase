"use client";
import { Suspense } from "react";
import Signup from "../Components/Signup";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
}
