import React from "react";

interface SocialCardProps {
  social: {
    name: string;
    icon: string;
  };
  isLinked: boolean;
  onLink: () => void;
  onUnlink: () => void;
}

const SocialCard: React.FC<SocialCardProps> = ({
  social,
  isLinked,
  onLink,
  onUnlink,
}) => {
  const handleClick = () => {
    if (isLinked) {
      onUnlink();
    } else {
      onLink();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center p-5 bg-white border border-gray-300 rounded-lg shadow-sm text-center transform transition hover:translate-y-[-5px] hover:shadow-md cursor-pointer"
    >
      <img src={social.icon} alt={social.name} className="w-10 h-10 mb-2" />
      <p className={`text-sm ${isLinked ? "text-green-500" : "text-gray-600"}`}>
        <span className="text-black">{social.name}</span>
        {isLinked ? (
          <span className="text-green-500 ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              fill="currentColor"
              className="w-4 h-4 inline-block"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 1 1-7.071 17.071A10 10 0 0 1 12 2Zm3.536 7.464a.75.75 0 1 0-1.06-1.06L12 9.939l-2.475-2.475a.75.75 0 1 0-1.06 1.06L12 12l3.536-3.536Z"
                clipRule="evenodd"
              />
            </svg> linked
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default SocialCard;
