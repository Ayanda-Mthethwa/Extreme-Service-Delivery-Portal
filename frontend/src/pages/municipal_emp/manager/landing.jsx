import React, { useState, useEffect } from 'react';
import '../../../scss/Manager/bootstrap-manager.scss';
import person from '../../../assets/person.jpg';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import {
    faFileLines, faUsers,
    faCircleQuestion, faBullhorn, faRightFromBracket,
    faChartPie, faCircleCheck, faClock, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Electricity from '../../../assets/electricity.png';
import Road from '../../../assets/road.png';
import Water from '../../../assets/water.png';
import Crime from '../../../assets/crime.png';
import useDeptIssues from '../../../hooks/useDeptIssues';
import { createAnnouncement } from "../../../services/announcementService";
import 'bootstrap/dist/css/bootstrap.min.css';
import SignOutModal from '../../../components/SignOutModal';
import StatCard from '../../../components/shared/StatCard';
import PageHeader from '../../../components/shared/PageHeader';
import Sidebar from '../../../components/shared/Sidebar';

function Landing() {
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState("");
    const [feedbackTitle, setfeedbackTitle] = useState("");
    const [showSignOut, setShowSignOut] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const { issues: deptIssues, loading } = useDeptIssues();
    const statsLoaded = !loading;
    const stats = {
        total:       deptIssues.length,
        completed:   deptIssues.filter(i => i.status === 'Completed').length,
        inProgress:  deptIssues.filter(i => i.status === 'In Progress').length,
        pending:     deptIssues.filter(i => i.status === 'Pending').length,
        complicated: deptIssues.filter(i => i.status === 'Complicated').length,
    };

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!statsLoaded) return;
        const numbers = document.querySelectorAll('.number');
        const svgCircles = document.querySelectorAll('svg circle');
        const counters = Array(numbers.length).fill(0);
        const intervals = [];

        numbers.forEach((number, index) => {
            intervals[index] = setInterval(() => {
                if (counters[index] === parseInt(number.dataset.num)) {
                    clearInterval(intervals[index]);
                } else {
                    counters[index] += 1;
                    number.innerHTML = counters[index] + '%';
                    svgCircles[index].style.strokeDashoffset = Math.floor(472 - 440 * parseFloat(number.dataset.num / 100));
                }
            }, 20);
        });

        return () => intervals.forEach(i => clearInterval(i));
    }, [statsLoaded]);

    const handleCancel = () => {
        setFeedbackContent('');
        setfeedbackTitle('');
        setShowFeedbackPopup(false);
    };

    const handleFeedbackSubmit = async () => {
        if (!feedbackContent) {
            toast.error("Announcement cannot be empty.");
            return;
        }
        try {
            const response = await createAnnouncement(feedbackTitle, feedbackContent);
            if (response.status === 201) {
                toast("Announcement sent successfully!");
                setFeedbackContent("");
                setfeedbackTitle("");
                setShowFeedbackPopup(false);
            }
        } catch (error) {
            toast.error("Failed to send announcement, please try again later.");
        }
    };

    const resolvedPct  = stats.total > 0 ? Math.round((stats.completed  / stats.total) * 100) : 0;
    const pendingPct   = stats.total > 0 ? Math.round((stats.pending    / stats.total) * 100) : 0;
    const inProgPct    = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;

    return (
        <>
        <div className="dashboard">
            <ToastContainer />

            {/* ── Sidebar ── */}
            <Sidebar
                className="manager-sidebar"
                picClass="man-profile-pic"
                profilePic={person}
                user={user}
                links={[
                    { to: '/issues',    icon: faFileLines,        label: 'Reported Issues' },
                    { to: '/assigned',  icon: faUsers,            label: 'Assigned Issues' },
                    { to: '/help',      icon: faCircleQuestion,   label: 'Help' },
                    { icon: faBullhorn,         label: 'Send Announcement', onClick: () => setShowFeedbackPopup(true) },
                    { icon: faRightFromBracket, label: 'Sign Out',          onClick: () => setShowSignOut(true) },
                ]}
            />

            {/* ── Announcement modal ── */}
            {showFeedbackPopup && (
                <div className="announce-overlay" onClick={handleCancel}>
                    <div className="announce-modal" onClick={e => e.stopPropagation()}>

                        <div className="announce-modal-header">
                            <div className="announce-modal-icon">
                                <FontAwesomeIcon icon={faBullhorn} />
                            </div>
                            <div className="announce-modal-heading">
                                <h3>Send Announcement</h3>
                                <p>Broadcast a message to all residents in your department</p>
                            </div>
                            <button className="announce-modal-close" onClick={handleCancel}>×</button>
                        </div>

                        <div className="announce-modal-body">
                            <div className="announce-field">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Water supply disruption in Zone 3"
                                    value={feedbackTitle}
                                    onChange={e => setfeedbackTitle(e.target.value)}
                                />
                            </div>
                            <div className="announce-field">
                                <label>Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Write your announcement here..."
                                    value={feedbackContent}
                                    onChange={e => setFeedbackContent(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="announce-modal-footer">
                            <button className="announce-btn-cancel" onClick={handleCancel}>Cancel</button>
                            <button className="announce-btn-submit" onClick={handleFeedbackSubmit}>
                                <FontAwesomeIcon icon={faBullhorn} />
                                Send Announcement
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ── Main content area ── */}
            <div className='dash-main'>

                {/* Page header */}
                <PageHeader
                    title="DASHBOARD"
                    subtitle={`Welcome back, ${user.name} 👋 here's your department overview`}
                />

                <div className='dash-inner'>

                    {/* Summary stat cards */}
                    <div className='stat-cards-row'>
                        <StatCard variant="total"        icon={faChartPie}            value={stats.total}       label="Total Issues" />
                        <StatCard variant="completed"    icon={faCircleCheck}         value={stats.completed}   label="Completed" />
                        <StatCard variant="in-progress"  icon={faClock}               value={stats.inProgress}  label="In Progress" />
                        <StatCard variant="pending"      icon={faTriangleExclamation}  value={stats.pending}     label="Pending" />
                    </div>

                    {/* Progress circles */}
                    <div className='progress-sec'>
                        <h3 className='progress-head'>Resolution Overview</h3>
                        <div className='progress-bars-sec'>

                            <div className='progress-container'>
                                <div className='status'>
                                    <div className='outer'>
                                        <div className='inner'>
                                            <div className='number' data-num={resolvedPct}></div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                            <defs>
                                                <linearGradient id="GradientColor">
                                                    <stop offset="0%" stopColor="#66b539" />
                                                    <stop offset="100%" stopColor="#1b4332" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="80" cy="80" r="70" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <span className='circle-label'>Resolved</span>
                                    <span className='circle-count'>{stats.completed} issue{stats.completed !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className='progress-container'>
                                <div className='status'>
                                    <div className='outer'>
                                        <div className='inner'>
                                            <div className='number' data-num={pendingPct}></div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                            <defs>
                                                <linearGradient id="GradientColor2">
                                                    <stop offset="0%" stopColor="#ffc107" />
                                                    <stop offset="100%" stopColor="#e65100" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="80" cy="80" r="70" strokeLinecap="round" style={{ stroke: '#ffc107' }} />
                                        </svg>
                                    </div>
                                    <span className='circle-label'>Pending</span>
                                    <span className='circle-count'>{stats.pending} issue{stats.pending !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className='progress-container'>
                                <div className='status'>
                                    <div className='outer'>
                                        <div className='inner'>
                                            <div className='number' data-num={inProgPct}></div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                            <defs>
                                                <linearGradient id="GradientColor3">
                                                    <stop offset="0%" stopColor="#2196f3" />
                                                    <stop offset="100%" stopColor="#0d47a1" />
                                                </linearGradient>
                                            </defs>
                                            <circle cx="80" cy="80" r="70" strokeLinecap="round" style={{ stroke: '#2196f3' }} />
                                        </svg>
                                    </div>
                                    <span className='circle-label'>In Progress</span>
                                    <span className='circle-count'>{stats.inProgress} issue{stats.inProgress !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Insight banner */}
                    <div className='stats-insight'>
                        <div className='insight-dot' />
                        <p className='insight-text'>
                            {stats.total === 0
                                ? 'No issues have been reported in your department yet.'
                                : `${stats.completed} of ${stats.total} issue${stats.total !== 1 ? 's' : ''} resolved (${resolvedPct}%). ${stats.inProgress} in progress, ${stats.pending} pending${stats.complicated > 0 ? `, ${stats.complicated} complicated` : ''}.`
                            }
                        </p>
                    </div>

                    {/* Information centre */}
                    <div className='departments-sec'>
                        <h3 className='info-head'>Information Centre</h3>
                        <div className='row g-3'>
                            <div className='col-md-6'>
                                <Card className='info-card h-100'>
                                    <Card.Img variant='top' src={Electricity} className='info-card-img' />
                                    <Card.Body>
                                        <Card.Title className='card-title'>Electricity</Card.Title>
                                        <Card.Text>Explore detailed information on electricity services, rates, loadshedding and policies.</Card.Text>
                                        <Link to='/electricity'><Button className='info-more-btn'>More Info</Button></Link>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className='col-md-6'>
                                <Card className='info-card h-100'>
                                    <Card.Img variant='top' src={Road} className='info-card-img' />
                                    <Card.Body>
                                        <Card.Title className='card-title'>Road and Transport</Card.Title>
                                        <Card.Text>Access essential details about road conditions, transport services, and local travel updates.</Card.Text>
                                        <Link to='/road'><Button className='info-more-btn'>More Info</Button></Link>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className='col-md-6'>
                                <Card className='info-card h-100'>
                                    <Card.Img variant='top' src={Water} className='info-card-img' />
                                    <Card.Body>
                                        <Card.Title className='card-title'>Water Supply and Infrastructure</Card.Title>
                                        <Card.Text>Discover important information about water supply and maintenance updates.</Card.Text>
                                        <Link to='/water'><Button className='info-more-btn'>More Info</Button></Link>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className='col-md-6'>
                                <Card className='info-card h-100'>
                                    <Card.Img variant='top' src={Crime} className='info-card-img' />
                                    <Card.Body>
                                        <Card.Title className='card-title'>Safety</Card.Title>
                                        <Card.Text>Stay informed about local safety initiatives, emergency services, and community safety tips.</Card.Text>
                                        <Link to='/safety'><Button className='info-more-btn'>More Info</Button></Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>

                </div>

                <footer className="manager-footer">
                    Copyright © 2024 · Extreme Service Delivery Portal
                </footer>
            </div>
        </div>

        <SignOutModal isOpen={showSignOut} onClose={() => setShowSignOut(false)} />
        </>
    );
}

export default Landing;
