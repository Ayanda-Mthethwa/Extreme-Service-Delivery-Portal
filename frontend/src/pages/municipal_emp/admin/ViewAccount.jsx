import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faUserTie, faUserShield, faUser,
  faMagnifyingGlass, faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { getMunicipalEmployees, deleteUser } from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import '../../../scss/Admin/viewaccount.scss';

const TABS = [
  { key: 'manager',    label: 'Managers',    icon: faUserTie },
  { key: 'supervisor', label: 'Supervisors',  icon: faUserShield },
  { key: 'admin',      label: 'Admins',       icon: faUser },
];

const ViewAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState('manager');
  const [supervisors, setSupervisors]   = useState([]);
  const [managers, setManagers]         = useState([]);
  const [admins, setAdmins]             = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [errorMsg, setErrorMsg]         = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    getMunicipalEmployees()
      .then((res) => {
        const all = res.data;
        setSupervisors(all.filter(u => u.role_name === 'SUPERVISOR'));
        setManagers(all.filter(u => u.role_name === 'MANAGER'));
        setAdmins(all.filter(u => u.role_name === 'ADMIN'));
      })
      .catch(console.error);
  }, []);

  const handleTabSwitch = (key) => {
    setActiveTab(key);
    setSearchTerm('');
    setSuccessMsg('');
  };

  const confirmDelete = () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    deleteUser(target)
      .then(() => {
        setSupervisors(prev => prev.filter(u => u.email !== target));
        setManagers(prev => prev.filter(u => u.email !== target));
        setAdmins(prev => prev.filter(u => u.email !== target));
        setSuccessMsg('User deleted successfully.');
        setTimeout(() => setSuccessMsg(''), 3500);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to delete user. Please try again.';
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 4000);
      });
  };

  const currentList = () => {
    const map = { manager: managers, supervisor: supervisors, admin: admins };
    return (map[activeTab] || []).filter(u =>
      `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="va-page">

      <button className="va-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="va-container">

        <div className="va-header">
          <h1 className="va-title">Account Management</h1>
          <p className="va-sub">View and manage employee accounts by role.</p>
        </div>

        {successMsg && <div className="va-success">{successMsg}</div>}
        {errorMsg   && <div className="va-error">{errorMsg}</div>}

        {/* Tabs */}
        <div className="va-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`va-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => handleTabSwitch(t.key)}
            >
              <FontAwesomeIcon icon={t.icon} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="va-search-wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="va-search-icon" />
          <input
            type="text"
            placeholder={`Search ${TABS.find(t => t.key === activeTab)?.label}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="va-search"
          />
        </div>

        {/* User list */}
        <div className="va-list">
          {currentList().length === 0 ? (
            <div className="va-empty">No accounts found.</div>
          ) : (
            currentList().map(user => (
              <div className="va-card" key={user.email}>
                <div className="va-avatar">{initials(user.name)}</div>
                <div className="va-info">
                  <span className="va-name">{user.name} {user.surname || ''}</span>
                  <span className="va-email">
                    <FontAwesomeIcon icon={faEnvelope} className="va-email-icon" />
                    {user.email}
                  </span>
                </div>
                <span className={`va-role-badge ${activeTab}`}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </span>
                <button className="va-delete" onClick={() => setDeleteTarget(user.email)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="va-modal-overlay">
          <div className="va-modal">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget}</strong>? This cannot be undone.</p>
            <div className="va-modal-actions">
              <button className="va-modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="va-modal-confirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewAccount;
