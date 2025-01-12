import React, { useState } from 'react';
import Navbar from '../Navbar';
import { useLocation } from 'react-router-dom';
import flameIcon from '../../img/Small.png';

// Helper: Get the longest consecutive streak in dateStrings
const getMaxConsecutiveStreak = (dateStrings) => {
  if (!dateStrings.length) return 0;
  const dateObjects = dateStrings.map(str => new Date(str));
  dateObjects.sort((a, b) => a - b);

  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < dateObjects.length; i++) {
    const diffInDays = (dateObjects[i] - dateObjects[i - 1]) / (1000 * 60 * 60 * 24);
    if (diffInDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  }
  return maxStreak;
};

// Helper: Return a Set of all dates that belong to a streak of length >= 2
const getMultiDayStreakDates = (dateStrings) => {
  if (dateStrings.length < 2) {
    return new Set();
  }
  const dateObjects = dateStrings.map(str => ({ str, date: new Date(str) }));
  dateObjects.sort((a, b) => a.date - b.date);

  const groups = [];
  let currentGroup = [dateObjects[0]];

  for (let i = 1; i < dateObjects.length; i++) {
    const diffInDays =
      (dateObjects[i].date - dateObjects[i - 1].date) / (1000 * 60 * 60 * 24);
    if (diffInDays === 1) {
      currentGroup.push(dateObjects[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [dateObjects[i]];
    }
  }
  if (currentGroup.length) groups.push(currentGroup);

  const multiDayStreakSet = new Set();
  groups.forEach(group => {
    if (group.length >= 2) {
      group.forEach(item => multiDayStreakSet.add(item.str));
    }
  });

  return multiDayStreakSet;
};

const UserDashboard = () => {
  const location = useLocation();
  const currentDate = new Date();

  // State: which month/year to show in the calendar
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [animationDirection, setAnimationDirection] = useState('');

  // 1. Attempt to read from `location.state`
  const quoteFromState = location.state?.quote;
  const fullNameFromState = location.state?.fullName;
  const streakArrayFromState = location.state?.streakHistoryArray;

  // 2. If missing, fallback to localStorage
  const fallbackQuote = localStorage.getItem('quote') || 'No quote available';
  const fallbackFullName = localStorage.getItem('fullName') || 'No name found';
  const fallbackStreakHistory = JSON.parse(localStorage.getItem('streakHistory') || '[]');

  // 3. Final data used in this component
  const quote = quoteFromState || fallbackQuote;
  const fullName = fullNameFromState || fallbackFullName;
  const streakHistoryArray = streakArrayFromState || fallbackStreakHistory;

  // Calendar navigation
  const handlePrevMonth = () => {
    setAnimationDirection('slide-right');
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setAnimationDirection('slide-left');
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Day of the week on which the month starts (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Filter streak history for the selected month/year
  const streakDaysInCurrentMonth = streakHistoryArray.filter((dateStr) => {
    const [year, month] = dateStr.split('-');
    return (
      parseInt(year, 10) === currentYear &&
      parseInt(month, 10) === currentMonth + 1
    );
  });

  // Calculate the largest consecutive streak (for display)
  const maxConsecutiveStreak = getMaxConsecutiveStreak(streakDaysInCurrentMonth);
  
  // Identify which dates (strings) are in a multi-day streak
  const multiDayStreakDates = getMultiDayStreakDates(streakDaysInCurrentMonth);

  return (
    <div className="user-dashboard">
      <Navbar />
      <div className="streak-container">
        <p>{fullName}</p>
        <h1 className="streak-title">
          Your Streak is <span>{maxConsecutiveStreak} Days</span>
        </h1>
      </div>
      <div className="quote-container">
        <h3 className="title-quote">Quote of the day</h3>
        <p className="text-quote">{quote}</p>
      </div>
      <div className="calendar">
        <div className="calendar-controls-month">
          <i className="fi fi-rs-angle-left" onClick={handlePrevMonth}></i>
          <h1 className="calendar-title">
            {new Date(currentYear, currentMonth).toLocaleString('default', {
              month: 'short',
            })}{' '}
            {currentYear}
          </h1>
          <i className="fi fi-rs-angle-right" onClick={handleNextMonth}></i>
        </div>
        {/* Calendar grid */}
        <div
          className={`calendar-grid ${animationDirection}`}
          onAnimationEnd={() => setAnimationDirection('')}
        >
          <p className='days'>Mon</p>
          <p className='days'>Tue</p>
          <p className='days'>Wed</p>
          <p className='days'>Thu</p>
          <p className='days'>Fri</p>
          <p className='days'>Sat</p>
          <p className='days'>Sun</p>

          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-cell empty"></div>
          ))}

          {/* One cell for each day of the month */}
          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            // Day number (1-based)
            const dayNumber = dayIndex + 1;
            // Format date as "YYYY-MM-DD"
            const formattedDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

            // Streak checks
            const isStreakDay = streakDaysInCurrentMonth.includes(formattedDay);
            const isMultiDayStreakDay = multiDayStreakDates.has(formattedDay);

            // Single-day streak if it's a streak day AND not in multi-day set
            const isSingleDayStreak = isStreakDay && !isMultiDayStreakDay;

            return (
              <div
                key={`day-${dayNumber}`}
                className={`calendar-cell ${
                  isSingleDayStreak
                    ? 'single-streak'
                    : isMultiDayStreakDay
                    ? 'multiple-streak'
                    : ''
                }`}
              >
                {/* Show the day number ONLY if this is a single-day streak */}
                {isSingleDayStreak && <span>{dayNumber}</span>}

                {/* Show flame ONLY if it's part of a multi-day streak */}
                {isMultiDayStreakDay && (
                  <span className="flame-icon">
                    <img src={flameIcon} alt="flame" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
