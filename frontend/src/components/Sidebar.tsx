import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logout from "./Logout";
import UserProfile from "./UserProfile";

const Sidebar: React.FC = () => {
  const location = useLocation(); // Get current URL path

  const navsLink = [
    { name: "Dashboard", path: "/" },
    { name: "Posts", path: "/post-manager" },
    { name: "Social Accounts", path: "/social-accounts" },
    { name: "User Profiles", path: "/user-profiles" },
    { name: "Analytics", path: "/analytics" },
    { name: "Messages", path: "/messages" },
    { name: "API Key", path: "/api-key" },
    { name: "Webhooks", path: "/webhooks" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-5 h-screen">
      <h2 className="text-lg mb-5 font-bold">Menu</h2>
      <UserProfile />
      <nav>
        {navsLink.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={`block mb-2 p-2 rounded transition ${
              location.pathname === item.path
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-800 hover:bg-gray-200"
            }`}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-5 left-5 right-5">
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;
