import { useState, useEffect } from "react";

const socialPlatforms = [
  { name: "Facebook", icon: "https://img.icons8.com/color/48/facebook-new.png" },
  { name: "Twitter", icon: "https://img.icons8.com/color/48/twitter.png" },
  { name: "YouTube", icon: "https://img.icons8.com/color/48/youtube-play.png" },
  { name: "LinkedIn", icon: "https://img.icons8.com/color/48/linkedin.png" },
  { name: "Instagram", icon: "https://img.icons8.com/color/48/instagram-new.png" },
  { name: "Pinterest", icon: "https://img.icons8.com/color/48/pinterest.png" },
  { name: "Reddit", icon: "https://img.icons8.com/color/48/reddit.png" },
  { name: "Telegram", icon: "https://img.icons8.com/color/48/telegram-app.png" },
  { name: "TikTok", icon: "https://img.icons8.com/color/48/tiktok.png" },
  { name: "Snapchat", icon: "https://img.icons8.com/color/48/snapchat.png" },
  { name: "WhatsApp", icon: "https://img.icons8.com/color/48/whatsapp.png" },
  { name: "Discord", icon: "https://img.icons8.com/color/48/discord-logo.png" },
];

export default function SocialNetworks() {
  // Holds the selected state for toggling each platform.
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  // Holds the active status (i.e. linked from backend) for each platform.
  const [activePlatforms, setActivePlatforms] = useState<{ [key: string]: boolean }>({
    Facebook: false,
    Twitter: false,
    YouTube: false,
    LinkedIn: false,
    Instagram: false,
    Pinterest: false,
    Reddit: false,
    Telegram: false,
    TikTok: false,
    Snapchat: false,
    WhatsApp: false,
    Discord: false,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const JwtToken = sessionStorage.getItem("access_token");

  // For now, check YouTube account status.
  useEffect(() => {
    if (!JwtToken) {
      console.error("No access token found.");
      return;
    }

    fetch(`${API_BASE_URL}/youtube/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update YouTube's active status based on API response.
        setActivePlatforms((prev) => ({ ...prev, YouTube: data.linked }));
        // If linked, mark YouTube as selected by default.
        if (data.linked) {
          setSelected((prev) => ({ ...prev, YouTube: true }));
        }
      })
      .catch((err) => {
        console.error("Error fetching account status:", err);
      });
  }, [JwtToken, API_BASE_URL]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Social Networks</h2>
      <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialPlatforms.map(({ name, icon }) => {
          // Check if this platform is active (i.e. linked)
          const isActive = activePlatforms[name];
          return (
            <label
              key={name}
              className={`flex items-center gap-2 ${
                isActive ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={!!selected[name]}
                onChange={() =>
                  isActive &&
                  setSelected((prev) => ({ ...prev, [name]: !prev[name] }))
                }
                disabled={!isActive}
              />
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${
                  isActive
                    ? selected[name]
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-200"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out ${
                    selected[name] ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
              <span className="text-gray-700 flex items-center gap-1">
                <img src={icon} alt={name} className="w-5 h-5" />
                {name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
