import { useState } from "react";

const socialPlatforms = [
  { name: "Facebook", icon: "https://img.icons8.com/color/48/facebook-new.png", active: false },
  { name: "Twitter", icon: "https://img.icons8.com/color/48/twitter.png", active: false },
  { name: "YouTube", icon: "https://img.icons8.com/color/48/youtube-play.png", active: true },
  { name: "LinkedIn", icon: "https://img.icons8.com/color/48/linkedin.png", active: false },
  { name: "Instagram", icon: "https://img.icons8.com/color/48/instagram-new.png", active: false },
  { name: "Pinterest", icon: "https://img.icons8.com/color/48/pinterest.png", active: false },
  { name: "Reddit", icon: "https://img.icons8.com/color/48/reddit.png", active: false },
  { name: "Telegram", icon: "https://img.icons8.com/color/48/telegram-app.png", active: false },
  { name: "TikTok", icon: "https://img.icons8.com/color/48/tiktok.png", active: false },
  { name: "Snapchat", icon: "https://img.icons8.com/color/48/snapchat.png", active: false },
  { name: "WhatsApp", icon: "https://img.icons8.com/color/48/whatsapp.png", active: false },
  { name: "Discord", icon: "https://img.icons8.com/color/48/discord-logo.png", active: false },
];

export default function SocialNetworks() {
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Social Networks</h2>
      <div className="bg-gray-100 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
        {socialPlatforms.map(({ name, icon, active }) => (
          <label key={name} className={`flex items-center gap-2 ${active ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
            <input
              type="checkbox"
              className="hidden"
              checked={!!selected[name]}
              onChange={() => active && setSelected(prev => ({ ...prev, [name]: !prev[name] }))}
              disabled={!active}
            />
            <div
              className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${
                active ? (selected[name] ? "bg-green-500" : "bg-red-500") : "bg-gray-200"
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
        ))}
      </div>
    </div>
  );
}
