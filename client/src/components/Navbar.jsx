import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
  return (
    <nav>
      <div>
        <img src="/assets/images/logo.png" alt="Logo" />
      </div>
      <div>
        <Link to="/landing">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/contact">CONTACT US</Link>
        <Link to="/login" className="button">LOGIN</Link>
      </div>
    </nav>
  );
};

export default NavBar;
