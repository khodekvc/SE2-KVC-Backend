import React from 'react';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';
import { Button } from './Button';

function NavBar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if(window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {showButton();}, []);

  window.addEventListener('resize', showButton);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="Logo" />
        </Link>
        <div className="menu-icon" onClick={() => setClick(!click)}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
          <ul className="nav-menu">
            <li className='nav-item'>
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                HOME
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
                ABOUT 
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
                CONTACT US
              </Link>
            </li>
            <li className='nav-item'>
              <Link to="/login" className="nav-links-login" onClick={closeMobileMenu}>
                LOGIN
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--primary'>LOGIN</Button>}
      </div>
    </nav>
  );
};

export default NavBar;
