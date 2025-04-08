import React, { useState, useEffect } from "react";

interface SocialMediaContent {
  youtube: {
    title: string;
    description: string;
    tags: string[];
  };
  tiktok: {
    title: string;
    description: string;
    hashtags: string[];
  };
  instagram: {
    caption: string;
    hashtags: string[];
  };
  x: {
    tweet: string;
    hashtags: string[];
  };
}

interface SocialMediaPreviewProps {
  generatedContent: SocialMediaContent;
  files: File[];
}

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({
  generatedContent,
  files,
}) => {
  // Create preview URL for the first file, if provided.
  const imagePreview = files.length > 0 ? URL.createObjectURL(files[0]) : null;

  // Track editing state per platform.
  const [isEditing, setIsEditing] = useState({
    youtube: false,
    tiktok: false,
    instagram: false,
    x: false,
  });

  // Store editable content in state.
  const [editedContent, setEditedContent] = useState<SocialMediaContent>(
    generatedContent
  );

  // In case the generatedContent changes from parent, update local state.
  useEffect(() => {
    setEditedContent(generatedContent);
  }, [generatedContent]);

  // Toggle editing mode for a platform.
  const toggleEdit = (platform: keyof SocialMediaContent) => {
    setIsEditing((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  // Handle changes for each field.
  const handleChange = (
    platform: keyof SocialMediaContent,
    field: string,
    value: string
  ) => {
    setEditedContent((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  // Handle array updates for hashtags or tags.
  // For simplicity, this example expects comma-separated values.
  const handleArrayChange = (
    platform: keyof SocialMediaContent,
    field: string,
    value: string
  ) => {
    setEditedContent((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value.split(",").map((item) => item.trim()),
      },
    }));
  };

  // Simulate posting the content.
  const handlePost = (platform: keyof SocialMediaContent) => {
    console.log(`Posting updated ${platform} content:`, editedContent[platform]);
    // Reset editing mode after posting.
    setIsEditing((prev) => ({ ...prev, [platform]: false }));
    // Here you could add an API call to post the updated content.
  };

  // Render each card based on the platform.
  const renderCard = (
    platform: keyof SocialMediaContent,
    labels: { title?: string; description?: string; caption?: string; tweet?: string; hashtagsLabel: string }
  ) => {
    const content = editedContent[platform];
    return (
      <div className="border rounded-lg shadow p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold">{platform.toUpperCase()}</h3>
          <div>
            <button
              onClick={() => toggleEdit(platform)}
              className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              {isEditing[platform] ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={() => handlePost(platform)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Post
            </button>
          </div>
        </div>
        {imagePreview && (
          <div className="mb-2">
            {files[0].type.startsWith("image") ? (
              <img
                src={imagePreview}
                alt={`${platform} Preview`}
                className="w-full h-auto object-cover rounded mb-2"
              />
            ) : (
              <video
                src={imagePreview}
                controls
                className="w-full h-auto object-cover rounded mb-2"
              />
            )}
          </div>
        )}
        {labels.title && (
          <div className="mb-2">
            <p className="font-semibold">Title:</p>
            {isEditing[platform] ? (
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={(content as any).title}
                onChange={(e) => handleChange(platform, "title", e.target.value)}
              />
            ) : (
              <p>{(content as any).title}</p>
            )}
          </div>
        )}
        {labels.description && (
          <div className="mb-2">
            <p className="font-semibold">Description:</p>
            {isEditing[platform] ? (
              <textarea
                className="w-full border rounded px-2 py-1"
                placeholder="Enter description here"
                value={(content as any).description}
                onChange={(e) =>
                  handleChange(platform, "description", e.target.value)
                }
              />
            ) : (
              <p>{(content as any).description}</p>
            )}
          </div>
        )}
        {labels.caption && (
          <div className="mb-2">
            <p className="font-semibold">Caption:</p>
            {isEditing[platform] ? (
              <textarea
                className="w-full border rounded px-2 py-1"
                placeholder="Enter caption here"
                value={(content as any).caption}
                onChange={(e) =>
                  handleChange(platform, "caption", e.target.value)
                }
              />
            ) : (
              <p>{(content as any).caption}</p>
            )}
          </div>
        )}
        {labels.tweet && (
          <div className="mb-2">
            <p className="font-semibold">Tweet:</p>
            {isEditing[platform] ? (
              <textarea
                className="w-full border rounded px-2 py-1"
                placeholder="Enter tweet here"
                value={(content as any).tweet}
                onChange={(e) =>
                  handleChange(platform, "tweet", e.target.value)
                }
              />
            ) : (
              <p>{(content as any).tweet}</p>
            )}
          </div>
        )}
        <div className="mb-2">
          <p className="font-semibold">{labels.hashtagsLabel}:</p>
          {isEditing[platform] ? (
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              placeholder="Enter comma-separated values"
              // Convert array to comma-separated string
              value={(content as any).hashtags ? (content as any).hashtags.join(", ") : (content as any).tags.join(", ")}
              onChange={(e) =>
                handleArrayChange(
                  platform,
                  (content as any).hashtags ? "hashtags" : "tags",
                  e.target.value
                )
              }
            />
          ) : (
            <ul className="list-disc ml-5">
              {(content as any).hashtags
                ? (content as any).hashtags.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))
                : (content as any).tags.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderCard("youtube", {
        title: "Title",
        description: "Description",
        hashtagsLabel: "Tags",
      })}
      {renderCard("tiktok", {
        title: "Title",
        description: "Description",
        hashtagsLabel: "Hashtags",
      })}
      {renderCard("instagram", {
        caption: "Caption",
        hashtagsLabel: "Hashtags",
      })}
      {renderCard("x", {
        tweet: "Tweet",
        hashtagsLabel: "Hashtags",
      })}
    </div>
  );
};

export default SocialMediaPreview;
