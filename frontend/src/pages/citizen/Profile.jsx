import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../scss/profile.scss'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from '../../assets/profile_picture.png';
import { mediaUrl } from '../../services/api';
import { updateProfilePicture } from '../../services/userService';
import { useNavigate } from 'react-router-dom'; // For navigation

const Profile = () => {
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Use the profilePic path from the user object or fall back to the default image
  const [profilePic, setProfilePic] = useState(user.profilePic ? mediaUrl(user.profilePic) : ProfilePicture);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for showing the success popup
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for showing the error popup

// Function to handle profile picture update
const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await updateProfilePicture(user.id, formData);

      // Log the response to verify the data returned by the backend
      console.log('Profile picture update response:', response);

      // Update state and localStorage with new profile picture
      const newProfilePic = response.data.profilePic;
      setProfilePic(mediaUrl(newProfilePic));
      user.profilePic = newProfilePic; // Update the user object
      localStorage.setItem('user', JSON.stringify(user)); // Save updated user info

      // Show success popup
      setShowSuccessPopup(true);
      setShowErrorPopup(false); // Hide error popup if any

      // Hide success popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error updating profile picture:', error);

      // Show error popup
      setShowErrorPopup(true);
      setShowSuccessPopup(false); // Hide success popup if any

      // Hide error popup after 3 seconds
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    }
  } else {
    console.error('No file selected.');
  }


};


  return (
    <div className='profile-page'>
      <div className="back-button-container">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-button"
                onClick={() => navigate('/homepage')}
        />
      </div>

      <div className="profile-header">
        <img 
          src={profilePic} // Use dynamic profile picture
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-actions">
          <label className="change-photo-button" htmlFor="file-input">
            Change Photo
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handlePhotoChange}
          />
        </div>
        <h2 className="full-name">{user.name} {user.surname}</h2>
      </div>

      <section className="section">
        <h2>Personal Information</h2>
        <p><strong>Username:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Full Name:</strong> {user.name} {user.surname}</p>
        <p><strong>Phone:</strong> {user.contact}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </section>

      <Link to='/editprofile'>
        <button className="edit-profile-button">Edit Profile</button>
      </Link>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <p>Profile picture updated successfully!</p>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="error-popup">
          <p>Failed to update profile picture. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
