import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa'; // استيراد الأيقونات
import '../App.css';
import { useTranslation } from 'react-i18next';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const token = localStorage.getItem('token');
  const menuIconStyle = {
    fontSize: '9rem', 
   
    marginRight: '30px',


  };
  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <img src="/lo.png" alt="Logo" className="logo" />

        <div className="menu-icon" onClick={toggleMenu} style={menuIconStyle}>
          {menuOpen ? <FaTimes className="menu-toggle" /> : <FaBars className="menu-toggle" />}
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {!token && <li><Link to="/">{t('Welcome')}</Link></li>}
          {!token && (
            <>
              <li><Link to="/login"><FaSignInAlt /> {t('Login')}</Link></li>
              <li><Link to="/register"><FaUserPlus /> {t('Register')}</Link></li>
            </>
          )}
          {token && (
            <>
              <li><Link to="/operations">{t('Operations')}</Link></li>
              <li>
                <Link 
                  to="/logout" 
                  onClick={() => {
                    localStorage.removeItem('token');
                  }} 
                >
                  <FaSignOutAlt /> {t('Logout')}
                </Link>
              </li>
            </>
          )}
          <li>
            <button onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </li>
          <li>
            <select onChange={(e) => changeLanguage(e.target.value)} value={localStorage.getItem('language')}>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;