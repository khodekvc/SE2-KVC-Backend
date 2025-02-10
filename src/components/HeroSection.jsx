import React from 'react'
import '../css/HeroSection.css'

function HeroSection() {
  return (
    <div className="hero-container">
      <img src="/landingbg.png" />
      <h1>
            KHO
            <br />
            VETERINARY
            <br />
            CLINIC
          </h1>
        <p>Four Paws, Two Feet, One Heart</p>
        <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'></Button>
    </div>
  )
}

export default HeroSection
