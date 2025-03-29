import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import AdminAuthenticator from "../components/AdminAuthenticator";
import Vendors from "../pages/Vendors";
import AdminCollection from "../pages/AdminCollection";
import AdminCollectionDetails from "../pages/AdminCollectionDetails";
import AdminProducts from "../pages/AdminProducts";

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
      <Route
        path="/vendors"
        element={
          <AdminAuthenticator>
            <Vendors />
          </AdminAuthenticator>
        }
      />
      <Route
        path="/collections"
        element={
          <AdminAuthenticator>
            <AdminCollection />
          </AdminAuthenticator>
        }
      />
      <Route
        path="/collections/:id"
        element={
          <AdminAuthenticator>
            <AdminCollectionDetails />
          </AdminAuthenticator>
        }
      />
      <Route
        path="/products"
        element={
          <AdminAuthenticator>
            <AdminProducts />
          </AdminAuthenticator>
        }
      />
    </Routes>
  );
};

export default AdminRouter;
