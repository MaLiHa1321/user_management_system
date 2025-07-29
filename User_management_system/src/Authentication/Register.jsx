import React, { useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hook/useAxiosPublic';

const Register = () => {
   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      const res = await axiosPublic.post("/register", formData);
      if (res.data?.insertedId || res.data?.success) {
        setSuccess("Registration successful! Redirecting to login page within 5s.");
        setTimeout(() => navigate("/login"), 2000);
      } else return setError("Registration failed");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");} }
    return (
        <div>
      <div className="container-fluid vh-100 overflow-hidden">
      <div className="d-flex flex-row  h-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center px-4 py-5">
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h2 className="mb-4 text-center">Register to The App</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label"> Name</label>
                <input type="text" name="name" className="form-control" placeholder="Username"  required onChange={handleChange}/>
              </div>
                <div className="mb-3">
                <label htmlFor="email" className="form-label"> E-mail</label>
                <input type="email" name="email" className="form-control" placeholder="test@example.com" required onChange={handleChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label"> Password</label>
                <input type="password" name="password" className="form-control" required onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button> 
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && <div className="alert alert-success mt-3">{success}</div>}
              <div className="d-flex justify-content-between mt-3">
                <a href="#" className="small"> Forgot password?</a>
                <Link to='/login'>Sign In</Link>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 w-100 login-right d-none d-md-block"></div>
      </div>
    </div>     
    </div>
    )};
export default Register;