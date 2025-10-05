"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const merchantOrderId = searchParams?.get("merchantOrderId");

  const [status, setStatus] = useState("CHECKING");

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus("FAILED");
      toast.error("No order ID found.");
      return;
    }

    let timerId;
    let mounted = true;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/phonepe/order-status?merchantOrderId=${merchantOrderId}`
        );

        if (!res.ok) throw new Error("Network response not ok");

        const data = await res.json();
        if (!mounted) return;

        switch (data.status) {
          case "SUCCESS":
            setStatus("SUCCESS");
            localStorage.removeItem("lastOrderId");

            toast.success("Payment successful! 🎉");

            if (data.emailStatus === "SENT") {
              toast.success("Confirmation email sent to your inbox!");
            } else if (data.emailStatus === "FAILED") {
              toast.error("We couldn't send email. Check your order later.");
            }
            break;

          case "FAILED":
            setStatus("FAILED");
            localStorage.removeItem("lastOrderId");
            toast.error("Payment failed");
            break;

          case "PENDING":
          default:
            timerId = setTimeout(checkStatus, 3000);
            break;
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error checking order status:", err);
        setStatus("FAILED");
        localStorage.removeItem("lastOrderId");
        toast.error("Error while checking payment status.");
      }
    };

    checkStatus();

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [merchantOrderId]);

  if (status === "CHECKING") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50">
        <div className="p-6 text-center bg-white shadow-md rounded-xl">
          <h2 className="text-xl font-bold text-yellow-600">
            Checking your order status...
          </h2>
          <p className="mt-2 text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-md rounded-xl">
          <h1 className="mb-4 text-3xl font-bold text-red-600">
            Payment Failed!
          </h1>
          <p className="mb-6 text-gray-700">
            Your payment could not be completed. Please try again.
          </p>
          <Link
            href="/checkout"
            className="inline-block px-6 py-2 text-white transition bg-red-600 rounded hover:bg-red-700"
          >
            Retry Payment
          </Link>
        </div>
      </div>
    );
  }

  // SUCCESS
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-green-50">
      <div className="flex flex-col items-center w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-extrabold text-green-700">
          Payment Successful!
        </h1>

        <p className="mb-6 text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
          <br />
          You will receive an email with order details shortly.
        </p>

        <Link
          href="/"
          className="px-6 py-3 font-semibold text-white transition-all duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
