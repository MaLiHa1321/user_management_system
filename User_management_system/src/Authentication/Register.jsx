import React, { useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    const navigate = useNavigate();
     const [success, setSuccess] = useState("");

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log(name,email,password);
    const userInfo = {name,email,password};
 try {
      const res = await axios.post("http://localhost:5000/register", userInfo);

      // Check insertedId if your backend returns it
      if (res.data?.insertedId || res.data?.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // wait 2 seconds
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

    return (
        <div>
             <div className="container-fluid vh-100 overflow-hidden">
      <div className="d-flex flex-row  h-100">
     
        <div className="col-md-6 d-flex align-items-center justify-content-center px-4 py-5">
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h2 className="mb-4 text-center">Register to The App</h2>
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
                <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="test@example.com"
                  onChange={(e) => setEmail(e.target.value)}
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

             

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
              
        {error && <div className="alert alert-danger mt-3">{error}</div>}
    

              <div className="d-flex justify-content-between mt-3">
                <a href="#" className="small">
                  Forgot password?
                </a>
                <Link to='/login'>Sign In</Link>
              </div>

            </form>
          </div>
        </div>

        <div className="col-md-6 w-100 login-right d-none d-md-block"></div>
      </div>
    </div>

            
        </div>
    );
};

export default Register;