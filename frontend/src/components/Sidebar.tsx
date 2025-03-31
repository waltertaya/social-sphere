import React from "react";
import Logout from "./Logout";
import UserProfile from "./UserProfile";

const Sidebar: React.FC = () => {
  const navsLink = [
    { name: "Dashboard", path: "/" },
    { name: "User Profiles", path: "/user-profiles" },
    { name: "Social Accounts", path: "/social-accounts" },
    { name: "Posts", path: "/post-manager" },
    { name: "Analytics", path: "/analytics" },
    { name: "Messages", path: "/messages" },
    { name: "API Key", path: "/api-key" },
    { name: "Webhooks", path: "/webhooks" },
  ];
  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-5">
      <h2 className="text-lg mb-5">Menu</h2>
      <UserProfile />
      <nav>
        {navsLink.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="block text-gray-800 mb-2 p-2 rounded hover:bg-gray-200 transition"
          >
            {item.name}
          </a>
        ))}
      </nav>
      <div className="absolute bottom-5 left-5 right-5">
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;
