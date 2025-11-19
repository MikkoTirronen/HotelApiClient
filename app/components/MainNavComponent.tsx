import { Link, useLocation } from "react-router";

const tabs = [
  { label: "Bookings", path: "/" },
  { label: "Rooms", path: "/rooms" },
  { label: "Customers", path: "/customers" },
];

export default function MainNav() {
  const location = useLocation();

  return (
    <nav className="flex border-b mb-4 space-x-4 px-4 py-2">
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.path);
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-t-lg font-medium text-base transition-all duration-200 ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
