import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import '../css/NavBar.css';
import { Button } from './Button';

function NavBar() {
  const [click, setClick] = useState(false); 
  const [button, setButton] = useState(true); 
  const handleClick = () => setClick(!click); 
  const closeMobileMenu = () => setClick(false); 

  const showButton = () => { 
    if(window.innerWidth <= 960) 
      { setButton(false); } 
    else { setButton(true); } 
  }; 
  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <RouterLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="Logo" />
        </RouterLink>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <ScrollLink 
              to="home" 
              smooth={true} 
              duration={500} 
              className="nav-links" 
              onClick={closeMobileMenu}
            >
              HOME
            </ScrollLink>
          </li>
          <li className='nav-item'>
            <ScrollLink 
              to="about" 
              smooth={true} 
              duration={500} 
              className="nav-links" 
              onClick={closeMobileMenu}
            >
              ABOUT
            </ScrollLink>
          </li>
          <li className='nav-item'>
            <ScrollLink 
              to="contact" 
              smooth={true} 
              duration={500} 
              className="nav-links" 
              onClick={closeMobileMenu}
            >
              CONTACT US
            </ScrollLink>
          </li>
          <li className='nav-item'>
            <RouterLink 
              to="/login" 
              className="nav-links-login" 
              onClick={closeMobileMenu}
            >
              LOGIN
            </RouterLink>
          </li>
        </ul>
        {button && <Button buttonStyle='btn--primary' to='/login'>LOGIN</Button>}
      </div>
    </nav>
  );
}
export default NavBar;
