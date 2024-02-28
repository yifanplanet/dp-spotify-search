import React from "react";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="fullscreen-container">
      <button
        className="btn-outline btn-outline-signin dp"
        onClick={handleLogin}
      >
        CONNECT WITH SPOTIFY
      </button>
    </div>
  );
};

export default Login;
