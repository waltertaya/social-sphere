import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Home: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<{
    [key: string]: boolean;
  }>({
    YouTube: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL;
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

  // Handle unlinking an account (only for YouTube as per requirements)
  const handleUnlinkAccount = (platform: string) => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    // Show confirmation popup before unlinking
    if (
      !window.confirm("Are you sure you want to unlink your YouTube account?")
    ) {
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/logout`, {
      method: "GET", // adjust method if needed by your backend
      headers: {
        Authorization: `Bearer ${JwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLinkedAccounts((prev) => ({ ...prev, [platform]: false }));
          alert("YouTube account unlinked successfully.");
        } else {
          alert("Failed to unlink the account.");
        }
      })
      .catch((error) => {
        console.error("Error during unlinking:", error);
        setError("Failed to unlink the account. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex h-screen select-none">
      {/* Sidebar */}
      <Sidebar />

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
              onClick={() => {
                if (social.name === "YouTube") {
                  if (linkedAccounts[social.name]) {
                    // If YouTube is already linked, handle unlinking with confirmation.
                    handleUnlinkAccount(social.name);
                  } else {
                    // If not linked, handle linking.
                    handleLinkAccount(social.name);
                  }
                } else {
                  // For other platforms, you can either show a message or handle accordingly.
                  if (linkedAccounts[social.name]) {
                    alert(`${social.name} is already linked.`);
                  } else {
                    handleLinkAccount(social.name);
                  }
                }
              }}
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
