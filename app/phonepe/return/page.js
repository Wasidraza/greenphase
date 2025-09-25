import dynamic from "next/dynamic";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/footer";

const PaymentStatusClient = dynamic(
  () => import("./PaymentStatus"),
  { ssr: false }
);

export default function PaymentReturn() {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1>Payment Status</h1>
        <PaymentStatusClient />
      </div>
      <Footer />
    </>
  );
}
