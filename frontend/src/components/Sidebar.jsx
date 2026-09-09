import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, UserCheck, FileSpreadsheet, Settings } from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar component for Dashboard and Analytics sub-navigation
 */
const Sidebar = ({ borrowerName = "Ramesh Kumar" }) => {
  return (
    <aside className="app-sidebar">
      {/* Borrower Context Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">{borrowerName.charAt(0)}</div>
        <div className="profile-info">
          <span className="profile-name">{borrowerName}</span>
          <span className="profile-id">ID: BR-89241</span>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="sidebar-group">
        <div className="sidebar-group-title">Analytics & Intelligence</div>

        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}>
          <LayoutDashboard size={18} />
          <span>Risk Overview</span>
        </NavLink>

        <NavLink to="/explainability" className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}>
          <BrainCircuit size={18} />
          <span>AI Decision Model</span>
        </NavLink>

        <NavLink to="/apply" className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}>
          <UserCheck size={18} />
          <span>Borrower Details</span>
        </NavLink>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-group-title">Documents</div>
        <div className="sidebar-item disabled">
          <FileSpreadsheet size={18} />
          <span>Transaction Ledgers</span>
        </div>
        <div className="sidebar-item disabled">
          <Settings size={18} />
          <span>Underwriting Rules</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
