import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignOutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '12px', padding: '36px 32px',
          width: '100%', maxWidth: '400px', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 700, color: '#1b2b1e' }}>
          Sign Out
        </h2>
        <p style={{ color: '#555', marginBottom: '24px', lineHeight: 1.5 }}>
          Are you sure you want to sign out? You will need to log in again to access the portal.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handleSignOut}
            style={{
              background: '#c0392b', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 24px', fontWeight: 600,
              fontSize: '15px', cursor: 'pointer',
            }}
          >
            Yes, sign me out
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#1b4332', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 24px', fontWeight: 600,
              fontSize: '15px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
