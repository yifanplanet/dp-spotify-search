import React from "react";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
