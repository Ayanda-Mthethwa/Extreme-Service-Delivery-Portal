import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown, faChevronUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getAssignedSupervisors, getIssuesBySupervisor } from "../../../services/issueService";

function AssignedIssues() {
    const [assignedSupervisors, setAssignedSupervisors] = useState([]);
    const [filteredSupervisors, setFilteredSupervisors] = useState([]);
    const [issuesBySupervisor, setIssuesBySupervisor] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchAssignedSupervisors = async () => {
            try {
                const response = await getAssignedSupervisors();
                setAssignedSupervisors(response.data);
                setFilteredSupervisors(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAssignedSupervisors();
    }, []);

    const handleSearch = (e) => {
        const q = e.target.value;
        setQuery(q);
        const lq = q.toLowerCase();
        setFilteredSupervisors(
            assignedSupervisors.filter(s =>
                s.name.toLowerCase().includes(lq) ||
                s.surname.toLowerCase().includes(lq) ||
                s.email.toLowerCase().includes(lq)
            )
        );
    };

    const handleToggle = async (supervisorID) => {
        if (expandedId === supervisorID) {
            setExpandedId(null);
            return;
        }
        setExpandedId(supervisorID);
        if (!issuesBySupervisor[supervisorID]) {
            try {
                const response = await getIssuesBySupervisor(supervisorID);
                setIssuesBySupervisor(prev => ({ ...prev, [supervisorID]: response.data }));
            } catch (error) {
                console.error('Error fetching issues:', error);
                setIssuesBySupervisor(prev => ({ ...prev, [supervisorID]: [] }));
            }
        }
    };

    const getStatusClass = (status) => (status || '').toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="issues-page">
            <header className="issues-header">
                <Link to='/landing'>
                    <FontAwesomeIcon icon={faArrowLeft} className="back-landing" />
                </Link>
                <h1 className="reported-header">ASSIGNED ISSUES</h1>
                <div style={{ width: 40 }} />
            </header>

            <div className="filt-sort">
                <span className="issues-count">
                    {filteredSupervisors.length} supervisor{filteredSupervisors.length !== 1 ? 's' : ''} assigned
                </span>
                <div className="assigned-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="assigned-content">
                {filteredSupervisors.length === 0 && (
                    <div className="no-results">No supervisors found.</div>
                )}
                {filteredSupervisors.map((supervisor) => {
                    const isOpen = expandedId === supervisor.id;
                    const issues = issuesBySupervisor[supervisor.id] || [];
                    return (
                        <div key={supervisor.id} className="supervisor-row">
                            <div className="supervisor-card-header">
                                <div className="supervisor-info">
                                    <div className="supervisor-avatar">
                                        {supervisor.name.charAt(0)}{supervisor.surname.charAt(0)}
                                    </div>
                                    <div className="supervisor-details">
                                        <span className="supervisor-name">{supervisor.name} {supervisor.surname}</span>
                                        <span className="supervisor-email">{supervisor.email}</span>
                                    </div>
                                </div>
                                <button
                                    className={`view-issues-btn ${isOpen ? 'open' : ''}`}
                                    onClick={() => handleToggle(supervisor.id)}
                                >
                                    {isOpen ? 'Hide Issues' : 'View Issues'}
                                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ marginLeft: 8 }} />
                                </button>
                            </div>

                            {isOpen && (
                                <div className="supervisor-issues">
                                    {issues.length === 0 ? (
                                        <p className="no-issues-text">No issues assigned to this supervisor.</p>
                                    ) : (
                                        issues.map((issue, idx) => (
                                            <div key={idx} className="assigned-issue-row">
                                                <span className="issue-num">#{idx + 1}</span>
                                                <div className="assigned-issue-info">
                                                    <span className="assigned-issue-desc">{issue.description || '—'}</span>
                                                </div>
                                                <span className={`issue-status-badge ${getStatusClass(issue.status)}`}>
                                                    {issue.status || 'Pending'}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AssignedIssues;
