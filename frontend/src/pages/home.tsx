import React, { useState, useEffect } from "react";

const Home: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<{
    [key: string]: boolean;
  }>({
    YouTube: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Base URL
  const API_BASE_URL = "http://localhost:8080/api/v2/youtube";
  // Retrieve the access token from session storage
  const JwtToken = sessionStorage.getItem("access_token");

  // Fetch the initial linked account status
  useEffect(() => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.linked) {
          setLinkedAccounts((prev) => ({ ...prev, YouTube: true }));
        }
      })
      .catch((err) => {
        console.error("Error fetching account status:", err);
        setError("Failed to fetch account status. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [JwtToken]);

  // Handle linking an account
  const handleLinkAccount = (platform: string) => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    if (platform === "YouTube") {
      setLoading(true);
      fetch(`${API_BASE_URL}/auth`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "already_linked") {
            alert("YouTube account is already linked.");
            setLinkedAccounts((prev) => ({ ...prev, YouTube: true }));
            return;
          }
          if (data.auth_url) {
            window.location.href = data.auth_url;
          } else {
            console.error("No auth_url received in the response.");
            setError("Failed to retrieve authentication URL.");
          }
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
          setError("Failed to link the account. Please try again.");
        })
        .finally(() => setLoading(false));
    } else {
      console.warn(`Platform ${platform} is not supported.`);
    }
  };

  return (
    <div className="flex h-screen select-none">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-grow p-5">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-2xl">Social Accounts</h1>
        </header>

        {/* Error and Loading Indicators */}
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Social Accounts Grid */}
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
              icon: "https://img.icons8.com/ios-filled/50/null/telegram-app.png",
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
