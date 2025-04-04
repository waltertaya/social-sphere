import React from "react";

interface PostCardProps {
  title: string;
  platform: string;
  content: string;
  timestamp: string;
  status: "Success" | "Scheduled" | "Paused" | "Awaiting Approval" | "Error";
  link?: string; // Optional link for more details
}

const statusColors: { [key: string]: string } = {
  Success: "text-green-600",
  Scheduled: "text-blue-600",
  Paused: "text-yellow-600",
  "Awaiting Approval": "text-orange-600",
  Error: "text-red-600",
};

// Function to extract YouTube video ID from a URL
const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
};

const PostCard: React.FC<PostCardProps> = ({
  platform,
  content,
  timestamp,
  status,
  link,
  title,
}) => {
  const videoId = link && platform === "YouTube" ? getYouTubeVideoId(link) : null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-md font-semibold">{platform}</h3>
      <h4 className="text-sm font-medium mt-2">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{content}</p>

      {/* If it's a YouTube post, embed the video */}
      {videoId ? (
        <div className="mt-3">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      ) : (
        // Otherwise, show a "View Post" link if available
        link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 block"
          >
            View Post
          </a>
        )
      )}

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleString()}
        </span>
        <span className={`text-xs font-semibold ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
