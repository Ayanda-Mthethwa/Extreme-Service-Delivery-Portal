import React, { useState, useEffect } from 'react';
import '../../../scss/Supervisor/IssueUpdate.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { mediaUrl } from '../../../services/api';
import { updateIssueStatus } from '../../../services/supervisorService';
import useAssignedIssues from '../../../hooks/useAssignedIssues';

const IssueUpdate = () => {
  const { issues: reportedIssues, setIssues: setReportedIssues } = useAssignedIssues();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('dateReported');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [previousStatus, setPreviousStatus] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => setUserLocation({ latitude: coords.latitude, longitude: coords.longitude }),
        () => {}
      );
    }
  }, []);

  const getImageUrl = (path) => mediaUrl(path);

  const getStatusClass = (status) => (status || '').toLowerCase().replace(/\s+/g, '-');

  const handleStatusChange = (issueID, status) => {
    const issue = reportedIssues.find(i => i.issue_id === issueID);
    setSelectedIssue(issue);
    setNewStatus(status);
    setPreviousStatus(issue.status);
    setShowPopup(true);
  };

  const confirmStatusChange = async () => {
    setShowPopup(false);
    setReportedIssues(prev =>
      prev.map(i => i.issue_id === selectedIssue.issue_id ? { ...i, status: newStatus } : i)
    );
    try {
      await updateIssueStatus(selectedIssue.issue_id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const cancelStatusChange = () => {
    setShowPopup(false);
    setReportedIssues(prev =>
      prev.map(i => i.issue_id === selectedIssue.issue_id ? { ...i, status: previousStatus } : i)
    );
  };

  const openMaps = (location) => {
    if (userLocation) {
      const dest = encodeURIComponent(location);
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${dest}`,
        '_blank'
      );
    }
  };

  const filteredIssues = reportedIssues
    .filter(issue =>
      (`${issue.reporter_name} ${issue.reporter_surname}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'dateReported') return new Date(b.date_reported) - new Date(a.date_reported);
      if (sortOption === 'reporter') return (a.reporter_name || '').localeCompare(b.reporter_name || '');
      return (a.location || '').localeCompare(b.location || '');
    });

  return (
    <div className="sup-issues-page">

      <header className="sup-issues-header">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="sup-back-btn"
          onClick={() => window.history.back()}
        />
        <h1 className="sup-issues-title">REPORTED ISSUES</h1>
        <div style={{ width: 36 }} />
      </header>

      <div className="sup-toolbar">
        <span className="sup-issue-count">
          {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} assigned
        </span>
        <div className="sup-controls">
          <div className="sup-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="sup-sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="dateReported">Sort by Date</option>
            <option value="reporter">Sort by Reporter</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>
      </div>

      <div className="sup-issues-list">
        {filteredIssues.length === 0 && (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
            No issues assigned yet.
          </p>
        )}
        {filteredIssues.map(issue => (
          <div key={issue.issue_id} className="sup-issue-card">
            <div className="card-inner">
              <div className="card-info">
                <span className={`sup-status-badge ${getStatusClass(issue.status)}`}>
                  {issue.status || 'Pending'}
                </span>
                <div className="card-meta">
                  <div className="info-line"><strong>Issue Type:</strong> {issue.issue_category || '—'}</div>
                  <div className="info-line">
                    <strong>Date Reported:</strong>{' '}
                    {new Date(issue.date_reported).toLocaleDateString('en-ZA', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </div>
                  <div className="info-line"><strong>Reported by:</strong> {issue.reporter_name} {issue.reporter_surname}</div>
                  <div className="info-line">
                    <strong>Location:</strong>{' '}
                    <span className="location-link" onClick={() => openMaps(issue.location)}>
                      {issue.location || '—'}
                    </span>
                  </div>
                </div>
                {issue.description && (
                  <div className="info-line"><strong>Description:</strong> {issue.description}</div>
                )}
              </div>

              <div className="card-right">
                {getImageUrl(issue.issue_image_path)
                  ? <img className="issue-thumb" src={getImageUrl(issue.issue_image_path)} alt="issue" />
                  : <span className="no-image-text">No image</span>
                }
                <select
                  className="status-select"
                  value={issue.status}
                  onChange={(e) => handleStatusChange(issue.issue_id, e.target.value)}
                  disabled={issue.status === 'Completed'}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Complicated">Complicated</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <p>Change status from <strong>{previousStatus}</strong> to <strong>{newStatus}</strong>?</p>
            <button className="confirm" onClick={confirmStatusChange}>Confirm</button>
            <button className="cancel" onClick={cancelStatusChange}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueUpdate;
