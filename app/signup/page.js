"use client";

import { useSearchParams } from "next/navigation";
import Signup from "../Components/Signup";

export default function SignupClient() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/product/smart-home-charger";

  return <Signup redirect={redirect} />;
}
