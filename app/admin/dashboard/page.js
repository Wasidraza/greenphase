import AdminProfile from "@/app/Components/AdminProfile";
import AdminNav from "../../Components/AdminNav";
import AdminSidebar from "../../Components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNav />
        <div className="p-6 lg:mt-20">
          {/* <h1 className="text-2xl font-bold">Admin Profile</h1> */}
          <AdminProfile/>
        </div>
      </div>
    </div>
  );
}
