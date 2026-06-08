import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faEnvelope, faLocationDot, faLock, faPhone, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import img1 from '../../assets/emalahleni.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registerResident } from '../../services/authService';
import '../../scss/signup.scss';

function Signup() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          setAddress(response.data.display_name.split(', ').slice(-5).join(', '));
        } catch (error) {
          console.error('Failed to fetch location:', error);
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await registerResident(data);
      if (response.status === 201) {
        navigate('/login');
      } else {
        setFormError(response.data.message);
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-heading">
          <img src={img1} alt="Logo" className="signup-logo" />
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
          <p className="signup-login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        {formError && (
          <p className="signup-error">{formError}</p>
        )}

        <form onSubmit={handleSubmit} className="signup-form" autoComplete="off">

          <div className="signup-row">
            <div className="signup-field">
              <FontAwesomeIcon icon={faCircleUser} className="signup-icon" />
              <input type="text" name="name" placeholder="Name" autoComplete="off" required />
            </div>
            <div className="signup-field">
              <FontAwesomeIcon icon={faCircleUser} className="signup-icon" />
              <input type="text" name="surname" placeholder="Surname" autoComplete="off" required />
            </div>
          </div>

          <div className="signup-field full">
            <FontAwesomeIcon icon={faEnvelope} className="signup-icon" />
            <input type="email" name="email" placeholder="Email Address" autoComplete="off" required />
          </div>

          <div className="signup-field full">
            <FontAwesomeIcon icon={faPhone} className="signup-icon" />
            <input type="text" name="contact" placeholder="Contact Number" autoComplete="off" required />
          </div>

          <div className="signup-field full">
            <FontAwesomeIcon icon={faLocationDot} className="signup-icon location" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="signup-field full">
            <FontAwesomeIcon icon={faLock} className="signup-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="signup-eye"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

      </div>
    </div>
  );
}

export default Signup;
