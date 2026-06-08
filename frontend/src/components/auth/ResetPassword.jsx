import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { resetPassword } from '../../services/authService';
import '../../scss/resetPassword.scss';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }
    const token = new URLSearchParams(window.location.search).get('token');
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setIsError(false);
      setMessage('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setIsError(true);
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="rp-page">
      <div className="rp-card">

        <div className="rp-icon-wrap">
          <FontAwesomeIcon icon={faLock} />
        </div>

        <h2 className="rp-title">Set New Password</h2>
        <p className="rp-subtitle">Choose a strong password for your account.</p>

        {!success ? (
          <form onSubmit={handleSubmit} className="rp-form" autoComplete="off">

            <div className="rp-input-wrap">
              <FontAwesomeIcon icon={faLock} className="rp-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="rp-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="rp-input-wrap">
              <FontAwesomeIcon icon={faLock} className="rp-input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <FontAwesomeIcon
                icon={showConfirm ? faEyeSlash : faEye}
                className="rp-eye-icon"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            </div>

            {message && (
              <p className={`rp-message ${isError ? 'error' : 'success'}`}>{message}</p>
            )}

            <button type="submit" className="rp-btn">Reset Password</button>
          </form>
        ) : (
          <div className="rp-success">
            <FontAwesomeIcon icon={faCircleCheck} className="rp-success-icon" />
            <p>{message}</p>
          </div>
        )}

        <Link to="/login" className="rp-back">Back to Login</Link>

      </div>
    </div>
  );
};

export default ResetPassword;
