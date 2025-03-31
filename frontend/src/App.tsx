import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const isAuthenticated = () => {
  const access_token = Cookies.get("access_token");
  if (access_token) {
    try {
      const decoded = jwtDecode(access_token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp && decoded.exp > currentTime) {
        return true; // Token is valid
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  return false;
};

// Auth guard component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
