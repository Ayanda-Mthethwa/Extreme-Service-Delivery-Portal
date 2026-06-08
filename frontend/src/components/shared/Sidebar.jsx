import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = ({ className, picClass, profilePic, user, links }) => (
  <aside className={className}>
    <img src={profilePic} className={picClass} alt="Profile" />
    <h2>{user.name} {user.surname}</h2>
    <p className="email">{user.email}</p>
    <div className="links-container">
      {links.map((link, i) =>
        link.to ? (
          <Link key={i} to={link.to}>
            <p className="links">
              {link.icon && <FontAwesomeIcon icon={link.icon} className="dash-icon" />}
              {link.label}
            </p>
          </Link>
        ) : (
          <p key={i} className="links" style={{ cursor: 'pointer' }} onClick={link.onClick}>
            {link.icon && <FontAwesomeIcon icon={link.icon} className="dash-icon" />}
            {link.label}
          </p>
        )
      )}
    </div>
  </aside>
);

export default Sidebar;
