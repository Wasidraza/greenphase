"use client";
import { Suspense } from "react";
import Signup from "../Components/Signup";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Signup />
    </Suspense>
  );
}
