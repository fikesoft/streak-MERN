import React from 'react'
import { useNavigate } from 'react-router-dom';


//Import photo
import PhotoHero from '../../img/hero-home.png';
export const Home = () => {
  const navigate = useNavigate();

  //Navigates to /login
  const handleGetStarted = () => {
    navigate('/login'); 
  };
  
  return (
    <div className='home-container'>  
      <div className='home-container-hero'>
          <img src={PhotoHero} alt='home-hero'></img>
      </div>
      <div className='home-container-content'>
        <h1 className='title'>  Can You Keep the Quote Streak Going? </h1>
        <p className='text'> Build a habit of inspiration with a fresh quote every day. Track your streak and turn small steps into big achievements! 🚀</p>
        <button className='btn-started' onClick={handleGetStarted}>Get Started <i class="fi fi-tr-arrow-turn-down-right"></i></button>
      </div>
    </div>
  )
}
export default Home;
