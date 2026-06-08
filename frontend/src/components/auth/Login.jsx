import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../../assets/emalahleni.png';
import { login } from '../../services/authService';
import '../../scss/login.scss';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await login(data);

      if (response.status === 200 && response.data.emailSent) {
        // Store email in localStorage and navigate to OTP page
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('maskedEmail', response.data.maskedEmail)
        
        navigate('/enter-otp');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);

        // Show "Forgot Password" link for incorrect password
      } else {
        console.error('Error:', error.message);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='home-page'>
      <div className='login-section'>
        <div className='form-heading'>
          <img src={img1} alt="Login" />
          <h1>Extreme Service Delivery Portal</h1>
          <p>Login to your account.</p>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className='details-div'>
            <label className='input-label'>EMAIL ADDRESS</label>
            <div className="input-container">
              <FontAwesomeIcon icon={faEnvelope} className='icon' />
              <input type='email' name='email' placeholder='Email Address' autoComplete="off" required />
            </div>
          </div>

          <div className='forgot-password'>
            <Link to="/forgotPassword" className="forgot-password-link">Forgot Password?</Link>
          </div>

          <div className='details-div'>
            <label className='input-label'>PASSWORD</label>
            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className='icon' />
              <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' autoComplete="new-password" required />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className='eye-icon'
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <p>
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up.</Link>
          </p>

          <button type='submit' className='btn-login'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
