import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../scss/reportIssue.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationArrow, faCamera, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { checkDuplicate, reportIssue } from '../../services/issueService';
import ReportErrorModal from './ReportErrorModal';
import ReportSuccessModal from './ReportSuccessModal';

const ReportIssue = () => {
    const navigate = useNavigate();
    const initialFormData = {
        location: '',
        description: '',
        issueCategory: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const [duplicatePostLink, setDuplicatePostLink] = useState(''); // To store the link to the duplicate post
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successModalMessage, setSuccessModalMessage] = useState('');

    const commonWords = ['is', 'a', 'are', 'the', 'for', 'to', 'of', 'and', 'in', 'on', 'with'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            setLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const address = response.data.display_name;
                        setFormData({ ...formData, location: address });
                    } catch (error) {
                        setErrorModalMessage('Failed to fetch location. Please enter manually.');
                        setErrorModalVisible(true);
                    } finally {
                        setLoadingLocation(false);
                    }
                },
                (error) => {
                    setErrorModalMessage('Unable to fetch location. Please enter it manually.');
                    setErrorModalVisible(true);
                    setLoadingLocation(false);
                }
            );
        } else {
            setErrorModalMessage('Geolocation is not supported by this browser.');
            setErrorModalVisible(true);
        }
    };

    const preprocessDescription = (description) => {
        return description
            .split(' ')
            .filter(word => !commonWords.includes(word.toLowerCase()))
            .join(' ');
    };

    const checkForDuplicates = async () => {
        try {
            const processedDescription = preprocessDescription(formData.description);
            const response = await checkDuplicate(
                formData.location,
                processedDescription,
                formData.issueCategory
            );
            if (response.data.isDuplicate) {
                // Save the link to the duplicate post if found
                setDuplicatePostLink(response.data.duplicatePostLink);
            }
            return response.data.isDuplicate;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isDuplicate = await checkForDuplicates();
        if (isDuplicate) {
            setErrorModalMessage('Duplicate issue detected: A similar issue has already been reported.');
            setErrorModalVisible(true);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('location', formData.location);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('issueCategory', formData.issueCategory);
            if (photo) {
                formDataToSend.append('photo', photo);
            }

            const response = await reportIssue(formDataToSend);
            setSuccessModalMessage(response.data.message);
            setSuccessModalVisible(true);
        } catch (error) {
            console.error(error);
            if (error.response) {
                setErrorModalMessage(error.response.data.message);
            } else {
                setErrorModalMessage('An error occurred. Please try again.');
            }
            setErrorModalVisible(true);
        }
    };

    return (
        <div className='goback-button'>
            <FontAwesomeIcon
                icon={faArrowLeft}
                className="back-button"
                onClick={() => navigate('/homepage')}
            />
            <div className="container">
                <h1>Report Issue</h1>
                <p className='ppp1'>Please provide issue details below:</p>

                <form className='form1' onSubmit={handleSubmit}>
                    <label className='labels' htmlFor="issueCategory">Select an issue below:</label>
                    <select
                        id="issueCategory"
                        name="issueCategory"
                        value={formData.issueCategory}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Issue Categories</option>
                        <option value="electricity">Electricity</option>
                        <option value="water">Water</option>
                        <option value="road">Road</option>
                        <option value="crime">Crime</option>
                        <option value="other">Other</option>
                    </select>

                    <label className='labels' htmlFor="description">Description of issue:</label>
                    <div className="description-container">
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Describe the issue in detail"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ flexGrow: 1 }}
                        ></textarea>
                        <button
                            type="button"
                            className="voice-note-button"
                            onClick={() => alert('Voice note recording feature coming soon!')}
                        >
                            <FontAwesomeIcon icon={faMicrophone} />
                        </button>
                    </div>

                    <label className='labels' htmlFor="location">Location:</label>
                    <div className="location-container">
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter location or use GPS"
                            value={formData.location}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className='gps-button'
                            onClick={handleGetLocation}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? 'Fetching...' : <FontAwesomeIcon icon={faLocationArrow} />}
                            {' '}current location
                        </button>
                    </div>

                    <label className='labels'>Take a Picture (optional):</label>
                    <div className="photo-container">
                        <button
                            type="button"
                            className='camera-button'
                            onClick={() => document.getElementById('photoUpload').click()}
                        >
                            <FontAwesomeIcon icon={faCamera} /> Upload from Device
                        </button>
                        <button
                            type="button"
                            className='camera-button'
                            onClick={() => document.getElementById('photoCamera').click()}
                        >
                            <FontAwesomeIcon icon={faCamera} /> Use Camera
                        </button>
                        <input
                            type="file"
                            id="photoUpload"
                            name="photoUpload"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="file"
                            id="photoCamera"
                            name="photoCamera"
                            accept="image/*"
                            capture="camera"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {photoPreview && (
                        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <p style={{ fontSize: '14px', color: '#555', marginBottom: '6px' }}>Selected photo:</p>
                            <img
                                src={photoPreview}
                                alt="Preview"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #d1ffbd' }}
                            />
                        </div>
                    )}

                    <button type="submit" className='submit-issue-button'>Report</button>
                </form>
            </div>

            {/* Error Modal */}
            <ReportErrorModal 
                isVisible={errorModalVisible}
                message={
                    <>
                        {errorModalMessage}
                        {duplicatePostLink && (
                            <div>
                                <a href={duplicatePostLink} target="_blank" rel="noopener noreferrer">
                                    View Reported Issue
                                </a>
                            </div>
                        )}
                    </>
                }
                onClose={() => {
                    setErrorModalVisible(false);
                    setDuplicatePostLink(''); // Reset link on close
                }}
            />

            {/* Success Modal */}
            <ReportSuccessModal
                isVisible={successModalVisible}
                message={successModalMessage}
                onClose={() => {
                    setSuccessModalVisible(false);
                    setFormData(initialFormData);
                    setPhoto(null);
                    setPhotoPreview(null);
                }}
            />
        </div>
    );
};

export default ReportIssue;
