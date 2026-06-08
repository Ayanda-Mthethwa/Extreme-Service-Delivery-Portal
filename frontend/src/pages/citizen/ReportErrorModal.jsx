import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../scss/reportErrorModal.scss';  // Import the updated styling

const ReportErrorModal = ({ isVisible, message, onClose }) => {
    if (!isVisible) return null; // Don't render the modal if it's not visible

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Notice</h2>  {/* Update heading to reflect informational message */}
                <p>{message}</p>
                <button className="modal-ok-button" onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default ReportErrorModal;
