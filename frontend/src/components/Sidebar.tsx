import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-5">
      <h2 className="text-lg mb-5">Menu</h2>
      <nav>
        {[
          "Dashboard",
          "User Profiles",
          "Social Accounts",
          "Posts",
          "Analytics",
          "Messages",
          "API Key",
          "Webhooks",
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className="block text-gray-800 mb-2 p-2 rounded hover:bg-gray-200 transition"
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
