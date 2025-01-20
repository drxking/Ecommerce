import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import AdminAuthenticator from "../components/AdminAuthenticator";
import Vendors from "../pages/Vendors";
import AdminCollection from "../pages/AdminCollection";

const AdminRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminAuthenticator>
            <Admin />
          </AdminAuthenticator>
        }
      />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/collections" element={<AdminCollection />} />
    </Routes>
  );
};

export default AdminRouter;
