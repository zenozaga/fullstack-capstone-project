import React, { useMemo, useState } from "react";

import "./RegisterPage.css";
import { urlConfig } from "../../config";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  //insert code here to create useState hook variables for firstName, lastName, email, password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = useMemo(() => {
    return firstName && lastName && email && password;
  }, [firstName, lastName, email, password]);

  // insert code here to create handleRegister function and include console.log
  const handleRegister = async () => {
    if (!isValid) return;

    setIsLoading(true);
    setError(null);

    const result = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).finally(() => setIsLoading(false));

    try {
      const data = await result.json();

      if (!result.ok) {
        setError(data?.message || "Registration failed");
        return;
      }

      navigate("/app/login");
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-6">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            {/* insert code here to create input elements for all the variables - firstName, lastName, email, password */}

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Enter your firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Enter your lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
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
              onClick={handleRegister}
              className="btn btn-primary w-100"
              disabled={!isValid || isLoading}
            >
              Register
            </button>
            <p className="mt-4 text-center">
              Already a member?{" "}
              <Link to="/app/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  ); //end of return
}

export default RegisterPage;
