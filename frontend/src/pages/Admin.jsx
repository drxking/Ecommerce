import React from "react";
import Main from "../components/Main";
import AdminNav from "../components/AdminNav";

const Admin = () => {
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminNav />
      <div className="flex">
        <div className="main w-full">
          <Main />
        </div>
      </div>
    </div>
  );
};

export default Admin;
