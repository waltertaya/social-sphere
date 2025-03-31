import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faUpload } from "@fortawesome/free-solid-svg-icons";
import SocialNetworks from "../components/SocialNetworks";

const PostManager = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <main className="p-6 bg-white rounded-lg shadow-md">
      {/* Send a Post Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">Send a Post</h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-600 hover:text-gray-800"
          title={isMinimized ? "Expand" : "Minimize"}
        >
          <FontAwesomeIcon icon={isMinimized ? faChevronDown : faChevronUp} />
        </button>
      </div>
      
      {!isMinimized && (
        <div>
          {/* Social Networks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Social Networks</label>
            <div className="flex flex-wrap gap-3 mt-2">
                <SocialNetworks />
            </div>
          </div>

          {/* Post Text */}
          <textarea
            className="w-full border p-2 rounded mt-2"
            rows={3}
            placeholder="Enter post text"
          />

          {/* Upload Section */}
          <div className="mt-4 border-dashed border-2 p-4 text-center rounded cursor-pointer hover:bg-gray-50">
            <FontAwesomeIcon icon={faUpload} className="text-gray-500" />
            <p className="text-sm text-gray-600">Click to Upload or Drag & Drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, MP4 up to 25MB</p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post Now</button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Schedule Post</button>
          </div>
        </div>
      )}

      {/* Post Timeline */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Post Timeline</h3>
        <p className="text-gray-500 mt-2">No posts found.</p>
      </div>
    </main>
  );
};

export default PostManager;
