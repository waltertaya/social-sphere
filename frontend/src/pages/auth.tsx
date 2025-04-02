import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/login" : "/register";
    const payload = isLogin
      ? { username, password }
      : { username, email, password };

    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, payload);
      setLoading(false);
      setSuccess(
        isLogin ? "Login successful!" : "Signup successful! Please log in."
      );

      if (isLogin) {
        const { access_token, refresh_token } = response.data;
        Cookies.set("access_token", access_token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refresh_token", refresh_token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        sessionStorage.setItem("access_token", access_token);
        window.location.href = "/";
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        isLogin
          ? "Login failed. Please check your credentials."
          : "Signup failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-purple-700">
          {isLogin ? "Log in to your account" : "Create an account"}
        </h2>

        {/* -- Social Logins --  */}
        <div className="mb-4 flex flex-row justify-center space-x-4">
          <button
            className="flex items-center justify-center rounded bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => console.log("Sign in with Google")}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M533.5 278.4c0-15.2-1.3-29.7-3.8-44H272v84h146.9c-6.4 34.5-25.2 63.6-53.4 83.1v68h86.4c50.4-46.4 81.6-114.9 81.6-191.1z"
                fill="#4285f4"
              />
              <path
                d="M272 544.3c72.6 0 133.5-24.1 178-65.5l-86.4-68c-24 16.2-54.7 25.8-91.6 25.8-70.3 0-129.8-47.4-151.2-111.1H33.1v69.3C77.5 495.3 169.3 544.3 272 544.3z"
                fill="#34a853"
              />
              <path
                d="M120.8 325.5c-6.3-18.9-9.8-39.1-9.8-60.5s3.5-41.6 9.8-60.5v-69.3H33.1C12 170.1 0 210.3 0 264.9s12 94.8 33.1 129.7l87.7-69.1z"
                fill="#fbbc04"
              />
              <path
                d="M272 124.4c39.4 0 74.7 13.6 102.6 40.5l77-77C405.3 56.2 344.6 32 272 32 169.3 32 77.5 81 33.1 179.1l87.7 69.3C142.2 184.7 201.7 124.4 272 124.4z"
                fill="#ea4335"
              />
            </svg>
            Sign in with Google
          </button>

          <button
            className="flex items-center justify-center rounded bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
            onClick={() => console.log("Sign in with Apple")}
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 14 17"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.6714 13.5732C13.2932 14.2882 12.9282 14.9623 12.5773 15.5947C12.0629 16.4873 11.4832 17.3637 10.6841 17.3494C9.92863 17.3342 9.60884 16.8594 8.64867 16.8594C7.69151 16.8594 7.31154 17.3494 6.60639 17.3647C5.80268 17.3799 5.17028 16.4471 4.65667 15.5545C3.47243 13.4465 2.27703 10.0024 3.75984 7.40611C4.46134 6.23986 5.62167 5.50538 6.90534 5.50538C7.77774 5.50538 8.56188 5.96452 9.15862 5.96452C9.71259 5.96452 10.5666 5.43149 11.5455 5.50538C11.9604 5.52409 12.9995 5.66283 13.7302 6.57831C13.0677 7.01496 12.4353 7.65569 12.7521 8.5704C13.1845 9.73552 14.3138 10.2384 14.4741 10.3116C14.4593 10.3431 14.2321 10.4352 13.6714 10.5912C14.2836 11.2407 14.6603 12.2277 14.6711 13.2581C14.6711 13.3793 14.6681 13.4991 14.6618 13.6176C14.6613 13.6278 14.6611 13.638 14.6611 13.6483C14.6435 13.6914 14.6084 13.7467 14.5851 13.7889C14.3967 14.1404 14.0084 14.6778 13.6714 13.5732ZM9.95628 3.67939C10.4518 3.08273 10.7872 2.29673 10.7872 1.48073C10.7872 1.36553 10.7762 1.24978 10.755 1.14675C9.97854 1.17766 9.10515 1.67929 8.63438 2.27003C8.19628 2.81652 7.81168 3.61252 7.81168 4.45488C7.81168 4.58176 7.83143 4.70898 7.8526 4.79276C7.9356 4.80293 8.02701 4.81338 8.12594 4.81338C8.93469 4.81338 9.70706 4.38356 10.1853 3.84025C10.3984 3.59986 10.5588 3.38415 10.6853 3.21652C10.674 3.20527 10.663 3.19367 10.6524 3.18152C10.5741 3.09014 10.2977 2.77428 9.95628 3.67939Z" />
            </svg>
            Sign in with Apple
          </button>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500">
            or continue with {isLogin ? "login" : "sign up"}
          </span>
        </div>

        {error && (
          <div className="mb-4 text-center text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-center text-sm text-green-600">
            {success}
          </div>
        )}

        <form className="mt-6 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute top-2/3 left-3 transform -translate-y-1/2 text-gray-400"
            />
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-purple-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute top-2/3 left-3 transform -translate-y-1/2 text-gray-400"
              />
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-purple-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>
          )}

          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute top-2/3 left-3 transform -translate-y-1/2 text-gray-400"
            />
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-purple-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-2/3 left-3 transform -translate-y-1/2 text-gray-400"
              />
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full rounded border border-gray-300 pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-purple-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
              />
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-medium text-purple-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className={`w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 flex justify-center items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex space-x-1">
                <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-200"></span>
                <span className="h-2 w-2 bg-white rounded-full animate-bounce delay-400"></span>
              </span>
            ) : isLogin ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          {isLogin ? (
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="ml-1 font-medium text-purple-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="ml-1 font-medium text-purple-600 hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
