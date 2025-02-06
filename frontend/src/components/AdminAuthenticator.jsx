import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MutatingDots } from "react-loader-spinner";

const AdminAuthenticator = ({ children }) => {
  let navigate = useNavigate();
  const [isAdmin, setisAdmin] = useState(false);
  async function getToken() {
    try {
      let response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/utils/isadmin`,
        {
          withCredentials: true,
        }
      );
      if (!response.data.isAdmin || !response.data.status == "success") {
        navigate("/admin/login");
      } else {
        setisAdmin(true);
      }
    } catch (err) {
      navigate("/admin/login");
    }
  }
  useEffect(() => {
    getToken();
  },[]);
  return (
    <>
      {isAdmin ? (
        <>{children}</>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center ">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#000"
            secondaryColor="#000"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    </>
  );
};

export default AdminAuthenticator;
