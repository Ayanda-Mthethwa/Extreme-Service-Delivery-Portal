import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import img1 from '../../assets/emalahleni.png';
import { verifyOtp, resendOtp as resendOtpService } from '../../services/authService';
import '../../scss/OtpInputPage.scss';

const OtpInput = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [countdown, setCountdown] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const stored = localStorage.getItem('maskedEmail');
    if (storedEmail && stored) {
      setEmail(storedEmail);
      setMaskedEmail(stored);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev > 0) return prev - 1;
        setCanResend(true);
        clearInterval(timer);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    if (/^\d{0,6}$/.test(e.target.value)) setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await verifyOtp(email, otp);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role_name);
      localStorage.setItem('user', JSON.stringify(user));
      switch (user.role_name) {
        case 'RESIDENT':   navigate('/homepage');   break;
        case 'ADMIN':      navigate('/adminhome');  break;
        case 'MANAGER':    navigate('/landing');    break;
        case 'SUPERVISOR': navigate('/suplanding'); break;
        default:
          setIsError(true);
          setMessage('You do not have the right role to access this page.');
      }
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtpService(email);
      setIsError(false);
      setMessage('A new OTP has been sent to your email.');
      setCountdown(90);
      setCanResend(false);
    } catch (error) {
      setIsError(true);
      setMessage('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="otp-page">
      <div className="otp-card">

        <img src={img1} alt="Logo" className="otp-logo" />

        <h2 className="otp-title">Verify Your Identity</h2>
        <p className="otp-subtitle">
          A 6-digit code was sent to <strong>{maskedEmail}</strong>.{' '}
          <Link to="/login" className="otp-not-you">Not you?</Link>
        </p>

        <form onSubmit={handleSubmit} className="otp-form">
          <input
            type="text"
            value={otp}
            onChange={handleChange}
            maxLength="6"
            className="otp-input"
            placeholder="• • • • • •"
            required
          />

          {message && (
            <p className={`otp-message ${isError ? 'error' : 'success'}`}>{message}</p>
          )}

          <button type="submit" className="otp-btn">Verify Code</button>
        </form>

        <div className="otp-resend">
          {canResend ? (
            <button className="otp-resend-btn" onClick={handleResendOtp}>
              <FontAwesomeIcon icon={faRotateRight} /> Resend OTP
            </button>
          ) : (
            <p className="otp-countdown">Resend code in <strong>{formatTime(countdown)}</strong></p>
          )}
        </div>

      </div>
    </div>
  );
};

export default OtpInput;
