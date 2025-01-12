// src/pages/Login/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/userControls';

export const Login = ({ setIsAuthenticated, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Attempt to login
      const data = await loginUser(email, password); 
      // data might look like:
      // { fullName: 'John Doe', isAdmin: false, streak: { history: [...], ... }, ... }

      setIsAuthenticated(true);
      setIsAdmin(data.isAdmin);

      // STORE the user data in localStorage, so we can retrieve it later.
      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('streakHistory', JSON.stringify(data.streak.history || []));
      // If the API response has a "quote" or something similar, store it here as well
      // But if not, we'll just store something placeholder
      localStorage.setItem('quote', 'No quote from login yet'); 

      // Navigate based on user role
      if (data.isAdmin) {
        //If we wanted to display some data from the admin like name
        navigate('/admin-dashboard',{state:{response:data}});
      } else {
        // Navigate to the "Congratulations" page with the data
        // We still pass it so that the next page can get it easily
        navigate('/user-congratulations', { state: { response: data } });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-register-container">
      <form className="login-register-content" onSubmit={handleSubmit}>
        <h1 className="title">Welcome back!</h1>
        <p className="text">Let’s help you keep up your streak</p>
          {error && (
          <div className="error-container">
            <i className="fi fi-rr-exclamation"></i>
            <p>{error}</p>
          </div>
        )}
        <div className="input-container">
          <p className="text-label">Email</p>
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <p className="text-label">Password</p>
          <input
            className="input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Log In</button>
        <p className="register-link">
          Not registered yet?{' '}
          <span onClick={handleRegisterClick} className="register-link-text">
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
