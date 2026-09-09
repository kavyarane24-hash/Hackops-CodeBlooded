import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, PlusCircle, LayoutDashboard, HelpCircle } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

/**
 * Top Navbar component with brand logo, main page links, and quick apply CTA
 */
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-icon-wrapper">
            <ShieldCheck size={26} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TrustLens<span className="brand-ai">.AI</span></span>
            <span className="brand-tagline">Informal Risk Intelligence</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/explainability" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <HelpCircle size={16} />
            <span>AI Explainability</span>
          </NavLink>
        </nav>

        {/* CTA Actions */}
        <div className="navbar-actions">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/apply')}
          >
            New Assessment
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
