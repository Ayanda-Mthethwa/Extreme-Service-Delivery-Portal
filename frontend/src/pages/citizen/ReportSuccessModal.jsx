import React from 'react';
import '../../scss/reportSuccessModal.scss'; // Assume you have a scss file for styling

const ReportSuccessModal = ({ isVisible, message, onClose }) => {
    if (!isVisible) return null; // Don't render the modal if it's not visible

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Success!</h2>
                <p>{message}</p>
                <button className="modal-ok-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default ReportSuccessModal;
