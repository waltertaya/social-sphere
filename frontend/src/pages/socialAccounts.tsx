import React, { useState, useEffect } from "react";
import socials from "../components/SocialAccounts";
import SocialList from "../components/SocialList";
import Accordion from "../components/Accordion";

const SocialAccounts: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<{
    [key: string]: boolean;
  }>({
    YouTube: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const JwtToken = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/bd/youtube/status`, {
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
  }, [JwtToken, API_BASE_URL]);

  const handleLinkAccount = (platform: string) => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    if (platform === "YouTube") {
      setLoading(true);
      fetch(`${API_BASE_URL}/bd/youtube/auth`, {
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
            setError("Failed to retrieve authentication URL.");
          }
        })
        .catch((error) => {
          console.error("Error linking account:", error);
          setError("Failed to link the account. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleUnlinkAccount = (platform: string) => {
    if (!JwtToken) {
      console.error("No access token found.");
      setError("Access token missing. Please log in.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to unlink your YouTube account?")
    ) {
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/bd/youtube/logout`, {
      method: "GET",
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
        console.error("Error unlinking account:", error);
        setError("Failed to unlink the account. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="flex-grow p-5">
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl display flex items-center">
          <img src="/app.svg" alt="Logo" className="w-10 h-10 mr-2" />
          <span className="text-gray-800 font-bold">Social Accounts</span>
        </h1>
        <p className="text-sm text-gray-600">
          Click an icon to link a social network account
        </p>
      </header>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <SocialList
        socials={socials}
        linkedAccounts={linkedAccounts}
        onLink={handleLinkAccount}
        onUnlink={handleUnlinkAccount}
      />
      <Accordion />
    </main>
  );
};

export default SocialAccounts;
