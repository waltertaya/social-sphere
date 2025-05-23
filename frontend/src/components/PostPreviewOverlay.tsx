import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

import YouTubePreview from "./SocialMediaPreview";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JwtToken = sessionStorage.getItem("access_token");

interface PostPreviewOverlayProps {
  postText: string;
  files: File[];
  onClose: () => void;
}

const PostPreviewOverlay: React.FC<PostPreviewOverlayProps> = ({
  postText,
  files,
  onClose,
}) => {
  const [generatedContent, setGeneratedContent] = useState<{ youtube: { title: string; description: string; tags: string[]; privacyStatus: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bd/chat-completion/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post: postText }),
        });

        const data = await response.json();
        setGeneratedContent({
          youtube: {
            title: data.youtube.title || "",
            description: data.youtube.description || "",
            tags: data.youtube.tags || [],
            privacyStatus: data.youtube.privacyStatus || "public",
          },
        });
      } catch (error) {
        console.log("Error fetching generated content:", error);
        alert("Error generating content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedContent();
  }, [postText]);

  return (
    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        title="Close Preview"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h2 className="text-2xl font-bold mb-4">Post Preview & Edit</h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-4xl text-blue-500"
          />
          <span className="ml-2 text-xl text-blue-500">
            Generating content...
          </span>
        </div>
      ) : (
        <div>
          <YouTubePreview
            content={generatedContent?.youtube || {}}
            file={files[0]}
          />
        </div>
      )}
    </div>
  );
};

export default PostPreviewOverlay;
