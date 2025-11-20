import { Link, useLocation } from "react-router";

export default function MainNavVertical() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Bookings", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Customers", path: "/customers" },
    {name: "Invoices", path:"/invoices"}
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`px-4 py-2 rounded ${
            currentPath === item.path
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
