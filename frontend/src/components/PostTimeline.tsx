import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PostList from "./PostList";

const PostTimeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState("All Posts");

  const posts: { title: string }[] = [];

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    "All Posts",
    "Success",
    "Scheduled",
    "Paused",
    "Awaiting Approval",
    "Error",
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">Post Timeline</h2>
        <span>
          {filteredPosts.length} of {posts.length} posts
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Recent Posts"
            className="border p-2 rounded w-64 pl-10 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            autoCorrect="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/3 text-gray-500"
          />
        </div>
        <label className="ml-4 flex items-center">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={() => setShowDeleted(!showDeleted)}
            className="mr-2"
          />
          Show Deleted
        </label>
      </div>

      <nav className="border-b pb-2 mb-4">
        <ul className="flex space-x-4">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-1 ${
                activeTab === tab
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
        <PostList />
    </div>
  );
};

export default PostTimeline;
