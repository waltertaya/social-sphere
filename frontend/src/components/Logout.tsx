import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from sessionStorage
    sessionStorage.removeItem('access_token');

    // Optional: Remove tokens from cookies
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to the login/auth page
    navigate('/auth');
  };

  return (
    <div className="relative group">
      <button 
        onClick={handleLogout} 
        className="flex items-center p-0 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
          <path fill="none" stroke="#3F51B5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2-2h5a2 2 0 0 0 2-2v-1"/>
        </svg>
        <span className="ml-2 text-gray-800 font-medium">Logout</span>
      </button>
      
      <span className="absolute left-0 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2">
        Logout
      </span>
    </div>
  );
};

export default Logout;
