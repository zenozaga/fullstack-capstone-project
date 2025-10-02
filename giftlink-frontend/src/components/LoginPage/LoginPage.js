import { useState } from "react";

import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AuthContext";
import { urlConfig } from "../../config";

function LoginPage() {
  const ctx = useAppContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValid = email && password;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValid) return setError("Please fill in all fields");

    setError(null);
    setIsLoading(true);

    const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).finally(() => setIsLoading(false));

    if (!response.ok) {
      return setError("Login failed. Please check your credentials.");
    }

    const data = await response.json();
    ctx.login(data.name, data.email, data.authToken);

    navigate("/app");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-6">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button
              disabled={!isValid || isLoading}
              className="btn btn-primary w-100 mb-3"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{" "}
              <Link to="/app/register" className="text-primary">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
