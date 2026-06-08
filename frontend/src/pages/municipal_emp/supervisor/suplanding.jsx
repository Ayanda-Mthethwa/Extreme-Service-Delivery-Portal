import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell, faChartPie, faCircleCheck, faClock, faTriangleExclamation,
  faArrowRight, faClipboardList, faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import useAssignedIssues from "../../../hooks/useAssignedIssues";
import useNotifications from "../../../hooks/useNotifications";
import "../../../scss/Supervisor/supervisor.scss";
import person from "../../../assets/person.jpg";
import bin from "../../../assets/deleteAnnounbin.png";
import SignOutModal from "../../../components/SignOutModal";
import StatCard from "../../../components/shared/StatCard";
import PageHeader from "../../../components/shared/PageHeader";
import Sidebar from "../../../components/shared/Sidebar";

const Suplanding = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const { issues } = useAssignedIssues();
  const { notifications, setNotifications, unreadCount, removeNotification } = useNotifications(user.id);

  const issueCounts = {
    submitted:   issues.filter(i => i.status === 'Pending').length,
    inProgress:  issues.filter(i => i.status === 'In Progress').length,
    completed:   issues.filter(i => i.status === 'Completed').length,
    complicated: issues.filter(i => i.status === 'Complicated').length,
  };
  const total = issues.length;

  const togglePopup = () => setPopupVisible(!isPopupVisible);
  const closePopup = () => setPopupVisible(false);

  const handleCardClick = (index) => {
    setNotifications(prev =>
      prev.map((n, i) => i === index ? { ...n, read: true } : n)
    );
    navigate("/issueupdate");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this notification?")) return;
    try {
      await removeNotification(id);
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div className="sup-dashboard">

      {/* ── Sidebar ── */}
      <Sidebar
        className="supervisor-sidebar"
        picClass="profile-pic"
        profilePic={person}
        user={user}
        links={[
          { to: '/issueupdate', label: 'View Assigned Issues' },
          { to: '/writereport', label: 'Write Report' },
          { to: '/help', label: 'Help' },
          { label: 'Sign Out', onClick: () => setShowSignOut(true) },
        ]}
      />

      {/* ── Main area ── */}
      <div className="sup-main">

        {/* Sticky header */}
        <PageHeader
          title="DASHBOARD"
          subtitle={`Welcome back, ${user.name} 👋 — here's your overview`}
          actions={
            <button className="sup-bell-btn" onClick={togglePopup}>
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && <span className="sup-badge">{unreadCount}</span>}
            </button>
          }
        />

        <div className="sup-inner">

          {/* Stat cards */}
          <div className="stat-cards-row">
            <StatCard variant="total"        icon={faChartPie}            value={total}                   label="Total Issues" />
            <StatCard variant="in-progress"  icon={faClock}               value={issueCounts.inProgress}  label="In Progress" />
            <StatCard variant="completed"    icon={faCircleCheck}         value={issueCounts.completed}   label="Completed" />
            <StatCard variant="pending"      icon={faTriangleExclamation}  value={issueCounts.complicated} label="Complicated" />
          </div>

          {/* Quick actions */}
          <div className="sup-quick-section">
            <h3 className="sup-section-head">Quick Actions</h3>
            <div className="sup-quick-grid">
              <Link to="/issueupdate" className="sup-quick-card">
                <div className="sup-quick-icon"><FontAwesomeIcon icon={faClipboardList} /></div>
                <div className="sup-quick-info">
                  <span className="sup-quick-title">Assigned Issues</span>
                  <span className="sup-quick-desc">View and update your assigned issues</span>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="sup-quick-arrow" />
              </Link>
              <Link to="/writereport" className="sup-quick-card">
                <div className="sup-quick-icon report"><FontAwesomeIcon icon={faPaperPlane} /></div>
                <div className="sup-quick-info">
                  <span className="sup-quick-title">Write Report</span>
                  <span className="sup-quick-desc">Send a report to your department manager</span>
                </div>
                <FontAwesomeIcon icon={faArrowRight} className="sup-quick-arrow" />
              </Link>
            </div>
          </div>

        </div>

        <footer className="sup-footer">Copyright © 2024 · Extreme Service Delivery Portal</footer>
      </div>

      {/* ── Notification popup ── */}
      {isPopupVisible && (
        <>
          <div className="overlay" onClick={closePopup} />
          <div className="notificationpopup">
            <button className="close-popup-button" onClick={closePopup}>&times;</button>
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>No notifications yet.</p>
            ) : (
              notifications.map((n, index) => (
                <div
                  key={n.id}
                  className={`notification-card ${n.read ? "read" : "unread"}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-date">
                    {new Date(n.created_at).toLocaleString("en-ZA", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit", hour12: false,
                    })}
                  </div>
                  <img src={bin} className="bin-pic" alt="delete"
                    onClick={(e) => handleDelete(n.id, e)} />
                </div>
              ))
            )}
            <button className="closenotification-button" onClick={closePopup}>Close</button>
          </div>
        </>
      )}

      <SignOutModal isOpen={showSignOut} onClose={() => setShowSignOut(false)} />
    </div>
  );
};

export default Suplanding;
