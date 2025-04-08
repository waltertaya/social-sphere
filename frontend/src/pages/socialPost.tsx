import { useState } from "react";
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faUpload,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import SocialNetworks from "../components/SocialNetworks";
import PostTimeline from "../components/PostTimeline";
import PostPreviewOverlay from "../components/PostPreviewOverlay";

const PostManager = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [postText, setPostText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file =>
      ["image/png", "image/jpeg", "video/mp4"].includes(file.type)
    );

    if (validFiles.length) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert("Invalid file type. Please upload a PNG, JPG, or MP4 file.");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file =>
      ["image/png", "image/jpeg", "video/mp4"].includes(file.type)
    );

    if (validFiles.length) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    } else {
      alert("Invalid file type. Please upload a PNG, JPG, or MP4 file.");
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clicking Post Now now just shows the overlay.
  const handlePostNow = () => {
    if (!postText.trim()) {
      alert("Please enter some post text.");
      return;
    }
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <main className="relative p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
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
            <label className="block text-sm font-medium text-gray-700">
              Social Networks
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              <SocialNetworks />
            </div>
          </div>

          {/* Post Text Input */}
          <textarea
            className="w-full border-2 border-gray-300 rounded p-2 mt-2 focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="Enter post text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          {/* Drag & Drop Upload Area */}
          <div
            className="mt-4 border-dashed border-2 p-4 text-center rounded cursor-pointer hover:bg-gray-50 border-gray-300"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <FontAwesomeIcon icon={faUpload} className="text-gray-500" />
              <p className="text-sm text-gray-600">Click to Upload or Drag & Drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, MP4 up to 25MB</p>
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/png, image/jpeg, video/mp4"
              multiple
              onChange={handleFileUpload}
            />
          </div>

          {/* File Previews */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-32 h-20 rounded"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove file"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              onClick={handlePostNow}
            >
              Post Now
            </button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer">
              Schedule Post
            </button>
          </div>
        </div>
      )}

      {/* Post Timeline */}
      <PostTimeline />

      {/* Post Preview Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex justify-center items-start pt-10 z-50">
          <PostPreviewOverlay
            postText={postText}
            files={selectedFiles}
            onClose={closeOverlay}
          />
        </div>
      )}
    </main>
  );
};

export default PostManager;
