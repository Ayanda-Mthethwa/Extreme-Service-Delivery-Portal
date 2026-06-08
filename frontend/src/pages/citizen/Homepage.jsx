import React, { useState, useEffect } from 'react';
import '../../scss/homepage.scss';
import logo from '../../assets/reportlogo.jpeg';
import ProfilePicture from '../../assets/profile_picture.png';
import img2 from '../../assets/road_potholes.webp';
import img3 from '../../assets/water.jpg';
import img4 from '../../assets/pothole2.jpg';
import img5 from '../../assets/road1.jpg';
import img6 from '../../assets/pothole1.jpg';
import img7 from '../../assets/Live-wires-from-electricity-thieves1.jpg';
import img8 from '../../assets/pipe3.jpg';
import img9 from '../../assets/infrastructure.jpg';
import img10 from '../../assets/elect2.jpg';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGear,
    faPeopleGroup,
    faQuestionCircle,
    faComments,
    faRightFromBracket,
    faUser,
    faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { mediaUrl } from '../../services/api';
import { getAnnouncements } from '../../services/announcementService';
import SignOutModal from '../../components/SignOutModal';

const images = [img2, img3, img4, img5, img6, img7, img8, img9, img10];

const Homepage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profilePic, setProfilePic] = useState(ProfilePicture);
    const [announcementIndex, setAnnouncementIndex] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSignOut, setShowSignOut] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        getAnnouncements()
            .then((response) => {
                setAnnouncements(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching announcements:', error);
                setError('Failed to fetch announcements');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (user && user.profilePic) {
            setProfilePic(mediaUrl(user.profilePic));
        }
    }, []);

    useEffect(() => {
        const imageInterval = setInterval(() => {
            if (!isSlideshowPaused) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }
        }, 7000);
        return () => { clearInterval(imageInterval); };
    }, [isSlideshowPaused]);

    useEffect(() => {
        const announcementInterval = setInterval(() => {
            if (!isSlideshowPaused && announcements.length > 0) {
                setAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
            }
        }, 5000);
        return () => { clearInterval(announcementInterval); };
    }, [isSlideshowPaused, announcements]);

    const handlePreviousAnnouncement = () => {
        setAnnouncementIndex(
            (prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length
        );
    };

    const handleNextAnnouncement = () => {
        setAnnouncementIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    };

    return (
        <div className="citizen-dashboard">
            <aside className="sidebar">
                <img src={profilePic} className="profile-pic" alt="Profile" />
                <h2>
                    {user.name} {user.surname}
                </h2>
                <div className="links-container">
                    <Link to="/profile">
                        <p className="links">
                            <FontAwesomeIcon icon={faUser} className="dash-icon" /> Profile
                        </p>
                    </Link>
                    <Link to="/status">
                        <p className="links">
                            <FontAwesomeIcon icon={faChartBar} className="dash-icon" /> View Issue Status
                        </p>
                    </Link>
                    <Link to="/newsfeed">
                        <p className="links">
                            <FontAwesomeIcon icon={faComments} className="dash-icon" /> Issues Newsfeed
                        </p>
                    </Link>
                    <Link to="/about">
                        <p className="links">
                            <FontAwesomeIcon icon={faPeopleGroup} className="dash-icon" /> About Us
                        </p>
                    </Link>
                    <Link to="/help">
                        <p className="links">
                            <FontAwesomeIcon icon={faQuestionCircle} className="dash-icon" /> Help
                        </p>
                    </Link>
                    <p className="links" style={{ cursor: 'pointer' }} onClick={() => setShowSignOut(true)}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="dash-icon" /> Sign out
                    </p>
                </div>
            </aside>

            <main className="content">
                <div className="slideshow-container">
                    {announcements.length > 0 ? (
                        <div className="announcements">
                            <h2>Notice!</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p style={{ color: 'red' }}>{error}</p>
                            ) : (
                                <div>
                                    <h3 className="title">{announcements[announcementIndex]?.title}</h3>
                                    <p className="message">{announcements[announcementIndex]?.message}</p>
                                    <p className="time">
                                        {announcements[announcementIndex]?.createdAt
                                            ? new Date(announcements[announcementIndex].createdAt).toLocaleString()
                                            : 'No Date Available'}
                                    </p>
                                </div>
                            )}
                            <div className="announcement-navigation">
                                <button onClick={handlePreviousAnnouncement} disabled={loading}>Previous</button>
                                <button onClick={handleNextAnnouncement} disabled={loading}>Next</button>
                            </div>
                        </div>
                    ) : (
                        <img
                            src={images[currentIndex]}
                            alt="Slideshow"
                            className="slideshow-image"
                        />
                    )}
                </div>

                <div className="welcome-message">
                    <h1 className="heading">Hey {user.name}, and Welcome Back!</h1>
                    <p>We're glad to have you back on our platform!</p>
                </div>
                <div className="report-prompt">
                    <p>Do you have an Issue to Report?</p>
                    <img src={logo} alt="Report Icon" className="report-icon" />
                    <Link to="/reportissue">
                        <button className="report-button">Click Here</button>
                    </Link>
                </div>
            </main>

            <footer className="footer">Copyright© @2024</footer>

            <SignOutModal isOpen={showSignOut} onClose={() => setShowSignOut(false)} />
        </div>
    );
};

export default Homepage;
