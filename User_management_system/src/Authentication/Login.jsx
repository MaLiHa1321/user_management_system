import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const navigate = useNavigate();
  const [error, setError] = useState("");

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(email,password);

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      if (res.data.success) {
        alert("Login successful");
        // navigate to dashboard or home
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };
   
  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="d-flex flex-row  h-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center px-4 py-5">
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h2 className="mb-4 text-center">Sign In to The App</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                   onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
               {error && <div className="alert alert-danger mt-3">{error}</div>}

              <div className="d-flex justify-content-between mt-3">
                <a href="#" className="small">
                  Forgot password?
                </a>
               <Link to='/register'>Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 w-100 login-right d-none d-md-block"></div>
      </div>
    </div>
  );
};

export default Login;
