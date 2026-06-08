import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import img1 from '../../assets/emalahleni.png';
import { forgotPassword } from '../../services/authService';
import '../../scss/forgotPassword.scss';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage('If this email is registered, a reset link has been sent. Check your inbox.');
      setIsError(false);
      setSubmitted(true);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">

        <img src={img1} alt="Logo" className="fp-logo" />

        <h2 className="fp-title">Forgot Password?</h2>
        <p className="fp-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="fp-form">
            <div className="fp-input-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="fp-input-icon" />
              <input
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className={`fp-message ${isError ? 'error' : 'success'}`}>{message}</p>
            )}

            <button type="submit" className="fp-btn">Send Reset Link</button>
          </form>
        ) : (
          <div className="fp-success">
            <FontAwesomeIcon icon={faCircleCheck} className="fp-success-icon" />
            <p>{message}</p>
          </div>
        )}

        <Link to="/login" className="fp-back">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
        </Link>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
