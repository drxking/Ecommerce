import Navbar from "../components/Navbar";
let links = [
  {
    name: "Products",
    link: "/admin/",
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
