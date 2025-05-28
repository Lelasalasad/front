import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, FaUserShield, FaWallet, FaHistory, FaBars, FaTimes, 
  FaSignInAlt, FaSignOutAlt, FaUserPlus, FaHome, FaMoneyBillWave 
} from 'react-icons/fa'; 
import { MdLanguage } from "react-icons/md";
import '../App.css';
import { useTranslation } from 'react-i18next';
import { AppContext } from './AppContext';

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAdmin } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <motion.nav className={`navbar${scrolled ? ' scrolled' : ''}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <img src="/lo.png" alt="Logo" className="logo" />

      <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
        {user ? (
          <>
            <li><Link to="/wallet"><FaWallet /> {t('MyWallet')}</Link></li> 
            {isAdmin && (
              <li><Link to="/AdminAccountMovements"><FaUserShield /> {t('AdminAccountMovements')}</Link></li>
            )}
            <li><Link to="/UserAccountMovements"><FaHistory /> {t('UserAccountMovements')}</Link></li>
            <li><Link to="/transactions"><FaMoneyBillWave /> {t('Transactions')}</Link></li>
            <li><Link to="/profile"><FaUserCircle /> {t('Profile')}</Link></li>
            <li><Link to="/logout"><FaSignOutAlt /> {t('Logout')}</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/welcome"><FaHome /> {t('Welcome')}</Link></li>
            <li><Link to="/register"><FaUserPlus /> {t('Register')}</Link></li>
            <li><Link to="/login"><FaSignInAlt /> {t('Login')}</Link></li>
          </>
        )}

        <div className="nav-footer">
          <li>
            <button onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
          </li>
          <li>
            <button className='lan' onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}>
              <MdLanguage />
            </button>
          </li>
        </div>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
