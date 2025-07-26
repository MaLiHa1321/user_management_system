import React, { useState } from 'react';
import "./Login.css";
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
//   const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(name,email,password);

    }
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