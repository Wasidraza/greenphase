// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export default function OrderSuccessClient() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const merchantOrderId = searchParams?.get("merchantOrderId");

//   const [status, setStatus] = useState("CHECKING");
//   const [orderDetails, setOrderDetails] = useState(null);

//   useEffect(() => {
//     if (!merchantOrderId) {
//       console.error("❌ No merchantOrderId in URL");
//       setStatus("FAILED");
//       toast.error("Invalid order reference.");
//       return;
//     }

//     console.log("🔍 Checking order status for:", merchantOrderId);

//     let intervalId;
//     let mounted = true;

//     const checkStatus = async () => {
//       try {
//         const res = await fetch(
//           `/api/phonepe/order-status?merchantOrderId=${merchantOrderId}`
//         );
        
//         if (!res.ok) throw new Error("Failed to fetch order status");
        
//         const data = await res.json();
//         console.log("📊 Order status response:", data);

//         if (!mounted) return;

//         if (data.status === "SUCCESS") {
//           setStatus("SUCCESS");
//           setOrderDetails(data.order);
//           localStorage.removeItem("lastOrderId");
//           toast.success("Payment successful! 🎉");
          
//           if (data.emailStatus === "SENT") {
//             toast.success("Confirmation email sent!");
//           }
          
//           // Stop checking
//           clearInterval(intervalId);
//         } 
//         else if (data.status === "FAILED") {
//           setStatus("FAILED");
//           localStorage.removeItem("lastOrderId");
//           toast.error("Payment failed ❌");
//           clearInterval(intervalId);
//         }
//         else if (data.status === "PENDING") {
//           setStatus("PENDING");
//           // Continue checking - don't show error
//           console.log("⏳ Payment still pending...");
//         }
//         else {
//           // Unknown status
//           setStatus("FAILED");
//           toast.error("Unable to verify payment status");
//           clearInterval(intervalId);
//         }
//       } catch (err) {
//         if (!mounted) return;
//         console.error("Error checking order status:", err);
//         // Don't set failed immediately, retry
//       }
//     };

//     // Immediate check
//     checkStatus();

//     // Set up interval for checking every 3 seconds
//     intervalId = setInterval(checkStatus, 3000);

//     // Timeout after 60 seconds
//     const timeoutId = setTimeout(() => {
//       if (mounted && status === "CHECKING") {
//         setStatus("FAILED");
//         toast.error("Payment verification timeout");
//         clearInterval(intervalId);
//       }
//     }, 60000);

//     return () => {
//       mounted = false;
//       clearInterval(intervalId);
//       clearTimeout(timeoutId);
//     };
//   }, [merchantOrderId, status]);

//   // Loading state
//   if (status === "CHECKING" || status === "PENDING") {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-blue-50">
//         <div className="p-8 text-center bg-white shadow-lg rounded-2xl">
//           <div className="flex justify-center mb-4">
//             <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
//           </div>
//           <h2 className="text-xl font-bold text-blue-600">
//             {status === "CHECKING" ? "Verifying your payment..." : "Payment processing..."}
//           </h2>
//           <p className="mt-2 text-gray-600">
//             Please wait while we confirm your payment status.
//           </p>
//           <p className="mt-1 text-sm text-gray-500">
//             Order ID: {merchantOrderId}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Failed state
//   if (status === "FAILED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
//         <div className="w-full max-w-md p-6 text-center bg-white shadow-lg rounded-xl">
//           <div className="flex justify-center mb-4">
//             <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//           </div>
//           <h1 className="mb-4 text-2xl font-bold text-red-600">Payment Failed!</h1>
//           <p className="mb-6 text-gray-700">
//             Your payment could not be completed. Please try again.
//           </p>
//           <div className="space-y-3">
//             <Link
//               href="/checkout"
//               className="block w-full px-6 py-3 font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
//             >
//               Retry Payment
//             </Link>
//             <Link
//               href="/"
//               className="block w-full px-6 py-3 font-semibold text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
//             >
//               Back to Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success state
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-green-50">
//       <div className="flex flex-col items-center w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
//         <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
//           <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//         </div>

//         <h1 className="mb-4 text-3xl font-extrabold text-green-700">Payment Successful!</h1>

//         {orderDetails && (
//           <div className="w-full p-4 mb-6 text-left rounded-lg bg-gray-50">
//             <h3 className="mb-2 font-semibold">Order Details:</h3>
//             <p><strong>Order ID:</strong> {orderDetails.merchantOrderId}</p>
//             <p><strong>Product:</strong> {orderDetails.productTitle}</p>
//             <p><strong>Amount:</strong> ₹{(orderDetails.amount / 100).toLocaleString("en-IN")}</p>
//           </div>
//         )}

//         <p className="mb-6 text-gray-600">
//           Thank you for your purchase! Your order has been confirmed.
//           <br />
//           You will receive an email with order details shortly.
//         </p>

//         <div className="w-full space-y-3">
//           <Link
//             href="/"
//             className="block w-full px-6 py-3 font-semibold text-white transition-all duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const merchantOrderId = searchParams?.get("merchantOrderId");

  const [status, setStatus] = useState("CHECKING");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!merchantOrderId) {
      console.error("No order ID found");
      setStatus("FAILED");
      toast.error("Invalid order reference");
      return;
    }

    console.log("🔍 Checking order status:", merchantOrderId);

    let intervalId;
    let mounted = true;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/phonepe/order-status?merchantOrderId=${merchantOrderId}`);
        
        if (!res.ok) throw new Error("Status check failed");
        
        const data = await res.json();

        if (!mounted) return;

        switch (data.status) {
          case "SUCCESS":
            setStatus("SUCCESS");
            setOrderDetails(data.order);
            localStorage.removeItem("lastOrderId");
            toast.success("Payment successful! 🎉");
            if (data.emailStatus === "SENT") {
              toast.success("Confirmation email sent!");
            }
            clearInterval(intervalId);
            break;

          case "FAILED":
            setStatus("FAILED");
            localStorage.removeItem("lastOrderId");
            toast.error("Payment failed");
            clearInterval(intervalId);
            break;

          case "PENDING":
            setStatus("PENDING");
            // Continue checking
            break;

          default:
            setStatus("FAILED");
            toast.error("Unable to verify payment");
            clearInterval(intervalId);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Status check error:", err);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds
    intervalId = setInterval(checkStatus, 3000);

    // Timeout after 2 minutes
    const timeoutId = setTimeout(() => {
      if (mounted && status === "CHECKING") {
        setStatus("FAILED");
        toast.error("Payment verification timeout");
        clearInterval(intervalId);
      }
    }, 120000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [merchantOrderId, status]);

  // Loading state
  if (status === "CHECKING" || status === "PENDING") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="p-8 text-center bg-white shadow-lg rounded-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-blue-600">
            {status === "CHECKING" ? "Verifying payment..." : "Processing payment..."}
          </h2>
          <p className="mt-2 text-gray-600">Please wait while we confirm your payment</p>
          <p className="mt-1 text-sm text-gray-500">Order: {merchantOrderId}</p>
        </div>
      </div>
    );
  }

  // Failed state
  if (status === "FAILED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
        <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-red-600">Payment Failed</h1>
          <p className="mb-6 text-gray-700">
            We couldn't process your payment. Please try again.
          </p>
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full px-6 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-green-50">
      <div className="flex flex-col items-center w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-extrabold text-green-700">Payment Successful!</h1>

        {orderDetails && (
          <div className="w-full p-4 mb-6 text-left rounded-lg bg-gray-50">
            <h3 className="mb-3 font-semibold">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> {orderDetails.merchantOrderId}</p>
              <p><strong>Product:</strong> {orderDetails.productTitle}</p>
              <p><strong>Color:</strong> {orderDetails.productColor}</p>
              <p><strong>Amount:</strong> ₹{(orderDetails.amount / 100).toLocaleString("en-IN")}</p>
              {orderDetails.customer && (
                <p><strong>Customer:</strong> {orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
              )}
            </div>
          </div>
        )}

        <p className="mb-6 text-gray-600">
          Thank you for your purchase! Your order has been confirmed.
          {orderDetails?.customer?.email && (
            <span className="block mt-2">A confirmation email has been sent to your inbox.</span>
          )}
        </p>

        <div className="w-full space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="block w-full px-6 py-3 font-semibold text-green-700 transition-colors bg-green-100 rounded-lg hover:bg-green-200"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}