import React, { useState, useEffect } from 'react';
import '../../scss/editProfile.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { updateDetails } from '../../services/userService';
import { useNavigate } from 'react-router-dom'; // For navigation

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.contact || '',
        address: user.address || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.id;

      // Make API call to update profile in the database
      const response = await updateDetails(userId, formData);

      // Update local storage with new user data if update was successful
      localStorage.setItem('user', JSON.stringify(response.data.updatedUser));

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);

      // Set error message and show error modal
      setErrorMessage('An error occurred while updating the profile. Please try again.');
      setShowErrorModal(true);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
    navigate('/profile'); // Redirect to '/profile' after closing modals
  };

  return (
    <div className='edit-profile-page'>
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="back-button"
        onClick={() => navigate('/homepage')}
      />

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <h2>Edit Profile</h2>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="save-button">Save Changes</button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Profile Updated Successfully!</h2>
            <p>Your profile has been updated.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{errorMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
