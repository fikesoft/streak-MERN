// src/pages/Congratulations/Congratulations.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar';
import flame from '../../../img/Small.png';
import { fetchTodaysQuote } from '../../../api/userControls'; // Adjust path as needed

export const Congratulations = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Congrats!");
  const [message, setMessage] = useState("You made your streak");
  const [quoteText, setQuoteText] = useState("Loading...");

  useEffect(() => {
    const getQuote = async () => {
      const quote = await fetchTodaysQuote();
      setQuoteText(quote);

      // Also store the quote in localStorage
      localStorage.setItem("quote", quote);
    };
    getQuote();

    // If the user has already logged in today
    if (location.state?.response?.message === "You have already logged in today. Come back tomorrow") {
      setTitle("Oops!");
      setMessage("You have already logged in today. Still the same quote :(");
    }

    // Update localStorage with the streak info if provided
    if (location.state?.response) {
      const res = location.state.response;
      if (res.fullName) {
        localStorage.setItem('fullName', res.fullName);
      }
      if (res.streak?.history) {
        localStorage.setItem('streakHistory', JSON.stringify(res.streak.history));
      }
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate("/user-dashboard", {
      state: {
        quote: quoteText,
        fullName: location.state?.response?.fullName,
        streakHistoryArray: location.state?.response?.streak?.history,
      },
    });
  };

  return (
    <div className='user-congrats'>
      <Navbar />
      <div className='user-congrats-content'>
        <div className='flame'>
          <img src={flame} alt='flame' />
        </div>
        <div className='title'>
          <h1 className='text-title'>{title}</h1>
          <p className='text-text'>{message}</p>
        </div>
        <div className='quote-container'>
          <h3 className='title-quote'>Quote of the day</h3>
          <p className='text-quote'>{quoteText}</p>
        </div>
        
        <button className="go-home-btn" onClick={handleGoHome}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default Congratulations;
