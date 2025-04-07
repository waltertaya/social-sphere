import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  timestamp: string;
  status: "Success" | "Scheduled" | "Paused" | "Awaiting Approval" | "Error";
  link?: string; // Optional link for more details
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
const JwtToken = sessionStorage.getItem("access_token");

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!JwtToken) {
      setError("No access token found.");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/youtube/videos`, {
      headers: { Authorization: `Bearer ${JwtToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("API Response:", data); // Debugging

        if (!data.items || !Array.isArray(data.items)) {
          setError("Invalid response from API.");
          setLoading(false);
          return;
        }

        const results: Post[] = data.items.map((item, index) => {
          return {
            id: item.id || `post-${index}`,
            title: item.snippet.title || "Untitled Post",
            platform: "YouTube",
            content: item.snippet.description || "No description available.",
            timestamp: item.snippet.publishedAt || new Date().toISOString(),
            status: "Success", // You may want to improve this logic
            link: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
          };
        });

        setPosts(results);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
        setError("Error fetching posts.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found. Please try publishing a post.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
