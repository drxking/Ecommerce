import React from "react";
import Main from "../components/Main";
import AdminNav from "../components/AdminNav";

const Admin = () => {
  
  return (
    <>
      <AdminNav />
      <div className="flex">
        <div className="main w-full">
          <Main />
        </div>
      </div>
    </>
  );
};

export default Admin;
