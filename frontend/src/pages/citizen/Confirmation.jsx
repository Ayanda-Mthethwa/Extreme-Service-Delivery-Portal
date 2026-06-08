import React from 'react';
import '../../scss/confirmation.scss';
import img1 from '../../assets/signup.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // For navigation

const Confirmation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="about-us-page">
            <FontAwesomeIcon
                icon={faArrowLeft}
                className="back-button"
                onClick={() => navigate('/homepage')}
            />
            
      <div className="content">
        <h1 className="confirm-button">Confirm Issue Resolved</h1>
        <img src={img1} alt="Issue Reporting Illustration" />
        <div className="issues">
          <div className="issue">
            <p>Water Supply Disruptions</p>
            <button className="issue-button">Confirm</button>
          </div>
          <div className="issue">
            <span>Roadway Maintenance Challenges</span>
            <button className="issue-button">Confirm</button>
          </div>
          <div className="issue">
            <span>Electricity Provision Concerns</span>
            <button className="issue-button">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
