import React, { useState, useEffect } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaShare,
  FaCommentDots,
  FaSave,
  FaUserCircle,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const JwtToken = sessionStorage.getItem("access_token");

const YouTubePreview: React.FC<{
  content: {
    title: string;
    description: string;
    tags: string[];
    privacyStatus: string;
  };
  file: File | null;
}> = ({ content, file }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(content);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setPreviewURL(URL.createObjectURL(file));
    }
  }, [file]);

  const handleChange = (field: string, value: string) => {
    setEdited((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (value: string) => {
    setEdited((prev) => ({
      ...prev,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handlePost = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", edited.title);
    formData.append("description", edited.description);
    formData.append("privacyStatus", edited.privacyStatus);

    fetch(`${API_BASE_URL}/youtube/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JwtToken}`, // DO NOT set 'Content-Type' here; the browser will set it automatically
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload successful:", data);
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
      });
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
      {/* Media preview */}
      <div className="relative bg-black h-64 flex items-center justify-center">
        {previewURL ? (
          file!.type.startsWith("image") ? (
            <img
              src={previewURL}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={previewURL}
              controls
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="text-white text-4xl">▶️</div>
        )}

        {/* Fake video progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-red-600">
          <div className="h-full bg-red-800 w-1/2"></div>
        </div>

        {/* Time marker */}
        <div className="absolute bottom-2 right-2 text-white text-xs bg-black bg-opacity-50 px-1 rounded">
          02:55 / 05:14
        </div>
      </div>

      {/* Title and description */}
      <div className="p-4">
        {isEditing ? (
          <>
            <label htmlFor="title-input" className="sr-only">
              Title
            </label>
            <input
              id="title-input"
              type="text"
              className="w-full border rounded px-2 py-1 mb-2"
              value={edited.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
            <textarea
              className="w-full border rounded px-2 py-1 mb-2"
              value={edited.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
            <input
              type="text"
              className="w-full border rounded px-2 py-1 mb-2"
              placeholder="Comma separated tags"
              value={edited.tags.join(", ")}
              onChange={(e) => handleArrayChange(e.target.value)}
            />
            <label htmlFor="privacy-status-select" className="sr-only">
              Privacy Status
            </label>
            <select
              id="privacy-status-select"
              className="w-full border rounded px-2 py-1 mb-2"
              value={edited.privacyStatus}
              onChange={(e) => handleChange("privacyStatus", e.target.value)}
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-1">{edited.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{edited.description}</p>
          </>
        )}

        {/* Action buttons */}
        <div className="flex items-center space-x-6 text-gray-600 mt-2 mb-3">
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaThumbsUp /> <span>1.2K</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaThumbsDown />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaShare /> <span>Share</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaCommentDots />
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <FaSave />
          </div>
        </div>

        {/* Channel + Subscribe */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl text-gray-500" />
            <span className="font-medium text-gray-800">Your Channel</span>
          </div>
          <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700">
            Subscribe
          </button>
        </div>

        {/* Edit / Post buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handlePost}
              className="px-4 py-1 bg-green-500 text-white rounded"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubePreview;
