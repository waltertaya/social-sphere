import { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState<{ email: string; username: string } | null>(
    null
  );
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const JwtToken = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (!JwtToken) {
      console.error("No access token found.");
      return;
    }

    fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [JwtToken, API_BASE_URL]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg shadow-md flex items-center gap-4">
      {/* User Info */}
      <div>
        <p className="text-sm font-semibold text-gray-800">Basic Plan</p>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
