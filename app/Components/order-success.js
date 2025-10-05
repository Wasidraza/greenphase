// app/order-success/page.js - Ye file create karo
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const merchantOrderId = searchParams.get("merchantOrderId");
  
  const [status, setStatus] = useState("CHECKING");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (merchantOrderId) {
      checkStatus();
    } else {
      setStatus("NO_ORDER_ID");
    }
  }, [merchantOrderId]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/phonepe/order-status?merchantOrderId=${merchantOrderId}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data);
        
        if (data.status === "SUCCESS") {
          setStatus("SUCCESS");
          localStorage.removeItem("lastOrderId");
        } else if (data.status === "FAILED") {
          setStatus("FAILED");
          localStorage.removeItem("lastOrderId");
        } else {
          // PENDING - check again after 3 seconds
          setTimeout(checkStatus, 3000);
        }
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      console.error("Status check error:", error);
      setStatus("ERROR");
    }
  };

  // Loading state
  if (status === "CHECKING") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <h2 className="mt-4 text-xl font-semibold">Checking Payment Status...</h2>
          <p className="text-gray-600">Order ID: {merchantOrderId}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "SUCCESS") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-green-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mb-6 text-gray-600">Thank you for your purchase</p>
            
            <div className="p-4 mb-6 text-left rounded-lg bg-gray-50">
              <p><strong>Order ID:</strong> {merchantOrderId}</p>
              <p><strong>Amount:</strong> ₹{(order.amount / 100).toLocaleString("en-IN")}</p>
              <p><strong>Product:</strong> {order.productTitle}</p>
              {order.phonepeOrderId && (
                <p><strong>Transaction ID:</strong> {order.phonepeOrderId}</p>
              )}
            </div>

            <Link 
              href="/"
              className="block w-full px-4 py-3 text-center text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (status === "FAILED") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-red-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-red-600">Payment Failed</h1>
            <p className="mb-6 text-gray-600">Your payment could not be processed</p>
            
            <div className="flex gap-3">
              <Link 
                href="/checkout"
                className="flex-1 px-4 py-3 text-center text-white transition duration-200 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Try Again
              </Link>
              <Link 
                href="/"
                className="flex-1 px-4 py-3 text-center text-white transition duration-200 bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-600">Something went wrong</h2>
        <p className="mb-6 text-gray-600">Please contact support with your Order ID</p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}