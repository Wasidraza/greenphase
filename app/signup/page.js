'use client';

import { useSearchParams } from 'next/navigation';
import Signup from '@/app/Components/Signup';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') ?? '/product/smart-home-charger';

  return <Signup redirect={redirect} />;
}
