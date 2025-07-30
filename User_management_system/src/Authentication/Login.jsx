import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../hook/useAxiosPublic";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
   const axiosPublic = useAxiosPublic();
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axiosPublic.post("/login", formData);
      console.log("Login response user:", res.data.user);
      if (res.data.success) {
        setSuccess("Login successful! Redirecting to Dashboard page within 5s.");
        setTimeout(() => navigate("/dashboard"), 2000);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Login error:", err);
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
                <label htmlFor="email" className="form-label">E-mail</label>
                <input type="email" name="email" className="form-control" required onChange={handleChange} placeholder="test@example.com"/>
               </div>
               <div className="mb-3">
                <label htmlFor="password" className="form-label"> Password</label>
                <input type="password" name="password" className="form-control" required onChange={handleChange}/>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
               {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
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
  )};
export default Login;
