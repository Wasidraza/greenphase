'use client';
import Footer from '@/app/Components/footer';
import Navbar from '@/app/Components/Navbar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentReturn() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('merchantOrderId');
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    if (!orderId) return setStatus('Order ID missing');
    fetch(`/api/phonepe/order-status?merchantOrderId=${orderId}`)
      .then(res => res.json())
      .then(data => setStatus(data?.data?.paymentState || 'Unknown'))
      .catch(() => setStatus('Error fetching status'));
  }, [orderId]);

  return (
   <>
   <Navbar/>
    <div className="p-8">
      <h1>Payment Status</h1>
      <p>Order ID: {orderId}</p>
      <p>Status: {status}</p>
    </div>
   <Footer/>
   </>
  );
}
