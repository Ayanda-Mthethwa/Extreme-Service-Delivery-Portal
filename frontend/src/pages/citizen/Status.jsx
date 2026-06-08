import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getMyIssues } from '../../services/issueService';
import '../../scss/status.scss';

function Status() {
    const [issues, setIssues] = useState([]);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        getMyIssues()
            .then(res => setIssues(res.data))
            .catch(err => setFetchError(
                err.response?.data?.message || 'An error occurred while fetching your issues.'
            ));
    }, []);

    return (
        <div>
            <FontAwesomeIcon
                icon={faArrowLeft}
                className="back-button"
                onClick={() => window.history.back()}
            />
            <div className='status-heading'>
                <h1>Reported Issues status</h1>
            </div>

            {fetchError && (
                <p style={{ color: '#c0392b', background: '#fdf0ef', border: '1px solid #f5c6cb', borderRadius: 6, padding: '10px 16px', margin: '0 0 16px' }}>
                    {fetchError}
                </p>
            )}

            {/* Wrap the report-details in a reports-grid container */}
            <div className="reports-grid">
                {issues.length > 0 ? (
                    issues.map((issue, index) => (
                        <div key={index} className='report-details'>
                            <h2>Issue Details</h2>
                            <div className='details-container'>
                                <div className='row'>
                                    <div className='description'>
                                        <p><strong>Description:</strong> {issue.description}</p>
                                    </div>
                                    <div className='issue-type'>
                                        <p><strong>Issue Type:</strong> {issue.issue_category}</p>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='report-date'>
                                        <p><strong>Report Date:</strong> {new Date(issue.date_reported).toLocaleDateString()}</p>
                                    </div>
                                    <div className='issue-status'>
                                        <p className='is-status'><strong className='status'>Status:</strong> {issue.status}</p>
                                    </div>
                                </div>

                                {issue.issue_image_path && (
                                    <div className="issue-image">
                                        <img src={issue.issue_image_path} alt="Issue" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No issues reported yet.</p>
                )}
            </div>
            <div className="button-container">
  <Link to='/homepage'>
    <button type='button' className='done-btn'>Done</button>
  </Link>
</div>

        </div>
    );
}

export default Status;
