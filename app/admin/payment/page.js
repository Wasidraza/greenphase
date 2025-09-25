import AdminNav from '@/app/Components/AdminNav';
import AdminSidebar from '@/app/Components/AdminSidebar';
import React from 'react'

function PaymentDetails() {
  return (
  <>
    <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminNav />
          <div className="p-6 lg:mt-2">
            <h2 className="text-2xl font-bold">Payment details</h2>

          </div>
        </div>
      </div>
  </>
  )
}

export default PaymentDetails;
