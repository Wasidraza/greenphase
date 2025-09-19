import React from "react";

function page() {
  return (
    <>
      <div className="container p-3 mx-auto pt-28">
        <h3 className="pb-3 text-3xl text-slate-900">Shipping Policy</h3>
        <p>Processing Time</p>
        <p className="pb-5">
          All orders are delivered within 10-15 business days. Orders are not
          shipped or delivered on weekends or holidays. If we are experiencing a
          high volume of orders, shipments may be delayed by a few days. Please
          allow additional days in transit for delivery. If there will be a
          significant delay in the shipment of your order, we will contact you
          via email or phone.
        </p>
        <h3 className="pb-3 text-3xl text-slate-900">
          Return and Refund policy
        </h3>
        <h3 className="pb-3">Return</h3>
        <p className="pb-2">
          We have a 7-day return policy, which means you have 7 days after
          receiving your item to request a return.
        </p>
        <p className="pb-4">
          Once the return product is received it will be inspected and the
          return will be approved within 2 days
        </p>
        <h3 className="pb-4">Refunds</h3>
        <p className="pb-20">
          We will notify you once we’ve received and inspected your return, and
          let you know if the refund was approved or not. If approved, you’ll be
          automatically Credited on your original payment method within 10
          business days. Please remember it can take some time for your bank or
          credit card company to process and post the refund too. If more than
          15 business days have passed since we’ve approved your return, please
          contact at +91-7827488393 / sale@greenphase.in .
        </p>
      </div>
    </>
  );
}

export default page;
