// src/Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/userControls.js';

export const Navbar = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const navigate = useNavigate();

  // Handle Logout
  const handleLogOut = async () => {
    try {
      const data = await logoutUser();
      console.log(data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Update date logic (for display)...
    // (This code is just for showing the date in the navbar)
    const now = new Date();
    const moscowTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
    const moscowDate = new Date(moscowTimeString);

    localStorage.setItem('date', moscowDate.toISOString());

    const formatted = moscowDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/Moscow'
    });

    setFormattedDate(formatted);
    console.log("Updated Date:", formatted);
  }, []);

  return (
    <div className='nav-bar'>
      <div className='today-date'>
        <p className='today-date-text'>{formattedDate || "No date found"}</p>
      </div>
      <div className='link'>
        {/* Note: No data is passed, just /user-dashboard */}
        <p className='link-item' onClick={() => navigate("/user-dashboard")}>Home</p>
        <p className='link-item' onClick={handleLogOut}>Logout</p>
      </div>
    </div>
  );
};

export default Navbar;
