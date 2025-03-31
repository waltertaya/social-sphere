import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SocialAccounts from "./socialAccounts";
import PostManager from "./socialPost";

const Home: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen select-none">
      {/* Sidebar remains visible */}
      <Sidebar />

      {/* Dynamic content area */}
      <div className="flex-grow p-6 bg-gray-100 w-full overflow-auto">
        {location.pathname === "/" && <SocialAccounts />}
        {location.pathname === "/post-manager" && <PostManager />}
      </div>
    </div>
  );
};

export default Home;
