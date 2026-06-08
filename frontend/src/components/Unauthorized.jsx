import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.iconCircle}>
          <FontAwesomeIcon icon={faLock} style={styles.lockIcon} />
        </div>

        <h1 style={styles.code}>403</h1>
        <h2 style={styles.title}>Access Denied</h2>
        <p style={styles.message}>
          You don't have permission to view this page. This area is restricted
          to authorised users only.
        </p>

        <div style={styles.divider} />

        <p style={styles.hint}>
          If you believe this is a mistake, please contact your system administrator.
        </p>

        <button style={styles.btn} onClick={() => navigate('/login')}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
          Back to Login
        </button>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0fff4 0%, #e8f5e1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'inherit',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(102, 181, 57, 0.15)',
    padding: '52px 44px',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: '#fff3cd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockIcon: {
    fontSize: 32,
    color: '#856404',
  },
  code: {
    fontSize: 64,
    fontWeight: 900,
    color: '#1b2b1e',
    margin: '0 0 4px',
    lineHeight: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1b2b1e',
    margin: '0 0 14px',
  },
  message: {
    fontSize: 15,
    color: '#555',
    lineHeight: 1.6,
    margin: 0,
  },
  divider: {
    width: 60,
    height: 3,
    background: '#d1ffbd',
    borderRadius: 2,
    margin: '24px 0',
  },
  hint: {
    fontSize: 13,
    color: '#999',
    margin: '0 0 28px',
    lineHeight: 1.5,
  },
  btn: {
    background: '#1b4332',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
};

export default Unauthorized;
