import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css';
import logo from "../../images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='navbarContainer'>
      {/* Burger Icon always visible */}
      <div className="burger-icon" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Full-Screen Overlay */}
      <div className={`overlay ${isOpen ? 'open' : ''}`}>
        {/* Links and Icons spread evenly */}
        <div className="overlay-content">

          <Link to="/" onClick={toggleMenu} className='logoLink'><img src={logo} alt="logo" className="logoImage" /></Link>
          <ul className="nav-links">
            <li style={{ animationDelay: '0.2s' }}>
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            <li style={{ animationDelay: '0.4s' }}>
              <Link to="/products" onClick={toggleMenu}>Products</Link>
            </li>
            <li style={{ animationDelay: '0.6s' }}>
              <Link to="/about" onClick={toggleMenu}>About</Link>
            </li>
            <li style={{ animationDelay: '0.8s' }}>
              <Link to="/contact" onClick={toggleMenu}>Contact</Link>
            </li>
          </ul>

          {/* Icons spread evenly */}
          <div className="nav-icons">
            <Link  to="/search" onClick={toggleMenu}><SearchIcon style={{ animationDelay: '1s'}} className="icon" /></Link>
            <Link to="/login" onClick={toggleMenu}><AccountCircleIcon style={{ animationDelay: '1.2s' }} className="icon" /></Link>
            <Link to="/cart" onClick={toggleMenu}><CartIcon style={{ animationDelay: '1.4s' }} className="icon" /></Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;