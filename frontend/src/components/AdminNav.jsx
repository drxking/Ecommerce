import Navbar from "../components/Navbar";

let links = [
  {
    name: "Dashboard",
    link: "/admin",
  },
  {
    name: "Products",
    link: "/admin/products",
  },
  {
    name: "Collections",
    link: "/admin/collections",
  },
  {
    name: "Orders",
    link: "/admin/orders",
  },
  {
    name: "Vendors",
    link: "/admin/vendors",
  },
];

const AdminNav = () => {
  return (
    <>
      <Navbar links={links} isAdmin={true} />
    </>
  );
};

export default AdminNav;
