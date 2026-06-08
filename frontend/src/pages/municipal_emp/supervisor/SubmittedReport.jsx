import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../../../scss/Supervisor/SubmittedReport.scss';

const SubmittedReport = () => {
  const location = useLocation();
  const confirmationMsg = location.state?.message || 'Your report has been sent to your department manager.';

  return (
    <div className="submitted-page">
      <div className="submitted-card">

        <div className="success-circle">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <h2 className="submitted-title">Report Sent!</h2>
        <p className="submitted-msg">{confirmationMsg}</p>

        <div className="submitted-divider" />

        <p className="submitted-hint">
          Your manager will review the report and follow up if necessary.
        </p>

        <div className="submitted-actions">
          <Link to="/suplanding" className="submitted-btn primary">
            <FontAwesomeIcon icon={faHouse} /> Back to Dashboard
          </Link>
          <Link to="/writereport" className="submitted-btn secondary">
            <FontAwesomeIcon icon={faFileAlt} /> Write Another Report
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SubmittedReport;
