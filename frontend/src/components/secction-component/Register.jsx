import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/userControls';

function RegisterForm() {
  const [fullName, setFullName] = useState(''); // State for full name
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate(); // Hook to navigate programmatically

  const validateInputs = () => {
    if (!fullName.trim()) {
      return 'Full name is required.';
    }
    if (fullName.trim().length < 3) {
      return 'Full name must be at least 3 characters long.';
    }
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return 'Full name can only contain letters and spaces.';
    }
    if (!email.trim()) {
      return 'Email is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address.';
    }
    if (!password.trim()) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const data = await registerUser(fullName, email, password); // Call the register API
      console.log(data.message); // "User registered successfully"
      navigate('/login'); // Redirect to the login page
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="login-register-container">
      <form className="login-register-content" onSubmit={handleSubmit}>
        <h1 className="title">Welcome Onboard</h1>
        <p className="text">Join us and keep your streak alive!</p>
        {error && (
          <div className="error-container">
            <i className="fi fi-rr-exclamation"></i>
            <p>{error}</p>
          </div>
        )}
        <div className="input-container">
          <p className="text-label">Full Name</p>
          <input
            className="input"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} // Update full name state
            required
          />
        </div>
        <div className="input-container">
          <p className="text-label">Email</p>
          <input
            className="input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
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
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>
        <div className="input-container">
          <p className="text-label">Confirm Password</p>
          <input
            className="input"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
            required
          />
        </div>
        <button type="submit" className="submit-button">Register</button>
        <p className="register-link">
          Already registered?{' '}
          <span onClick={handleLoginClick}>
            Go to login
          </span>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
