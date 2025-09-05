"use client";

import Signup from "../Components/Signup";

export default function SignupPage({ searchParams }) {

  const redirect = searchParams?.redirect || "/product/smart-home-charger";

  return <Signup redirect={redirect} />;
}
