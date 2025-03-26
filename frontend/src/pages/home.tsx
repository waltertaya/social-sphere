import React, { useState } from "react";

const Home: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<{
    [key: string]: boolean;
  }>({
    YouTube: false,
  });

  const handleLinkAccount = (platform: string) => {
    if (platform === "YouTube") {
      // Simulate authentication (replace with actual API call)
      fetch("http://localhost:8080/auth")
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.auth_url; // Redirect to auth URL
        })
        .catch((error) => console.error("Error during authentication:", error));
    }
  };

  const handleAccountLinked = (platform: string) => {
    // This function will be triggered after successful authentication
    setLinkedAccounts((prev) => ({ ...prev, [platform]: true }));
  };

  return (
    <div className="flex h-screen select-none">
      <aside className="w-64 bg-white border-r border-gray-300 p-5">
        <h2 className="text-lg mb-5">Menu</h2>
        <nav>
          {[
            "User Profiles",
            "Social Accounts",
            "Posts",
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
      <main className="flex-grow p-5">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Social Accounts</h1>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[
            {
              name: "YouTube",
              icon: "https://img.icons8.com/ios-filled/50/null/youtube-play.png",
            },
            {
              name: "Facebook",
              icon: "https://img.icons8.com/ios-filled/50/null/facebook-new.png",
            },
            {
              name: "Instagram",
              icon: "https://img.icons8.com/ios-filled/50/null/instagram-new.png",
            },
            {
              name: "LinkedIn",
              icon: "https://img.icons8.com/ios-filled/50/null/linkedin.png",
            },
            {
              name: "Twitter",
              icon: "https://img.icons8.com/ios-filled/50/null/twitter.png",
            },
            {
              name: "Reddit",
              icon: "https://img.icons8.com/ios-filled/50/null/reddit.png",
            },
            {
              name: "Telegram",
              icon: "https://img.icons8.com/ios-filled/50/null/telegram-Home.png",
            },
            {
              name: "TikTok",
              icon: "https://img.icons8.com/ios-filled/50/null/tiktok.png",
            },
          ].map((social, index) => (
            <div
              key={index}
              onClick={() =>
                linkedAccounts[social.name]
                  ? alert(`${social.name} is already linked.`)
                  : handleLinkAccount(social.name)
              }
              className="flex flex-col items-center justify-center p-5 bg-white border border-gray-300 rounded-lg shadow-sm text-center transform transition hover:translate-y-[-5px] hover:shadow-md cursor-pointer"
            >
              <img
                src={social.icon}
                alt={social.name}
                className="w-10 h-10 mb-2"
              />
              <p
                className={`text-sm ${
                  linkedAccounts[social.name]
                    ? "text-green-500"
                    : "text-gray-600"
                }`}
              >
                {linkedAccounts[social.name] ? "Linked" : social.name}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
