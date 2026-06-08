import React, { useState } from 'react';
import { getAllIssues } from '../../../services/issueService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../scss/Admin/monthly.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChartBar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import img1 from '../../../assets/emalahleni.png';

const AdminReportPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      setError('Please select both a start date and end date.');
      return;
    }
    if (startDate > endDate) {
      setError('Start date cannot be after end date.');
      return;
    }
    setError('');
    try {
      const response = await getAllIssues({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
      navigate('/monthlydetail', {
        state: {
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString(),
          reports: response.data,
        },
      });
    } catch (err) {
      setError('Failed to fetch reports. Please try again.');
    }
  };

  return (
    <div className="mr-page">
      <button className="mr-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="mr-card">
        <img src={img1} alt="Logo" className="mr-logo" />

        <h2 className="mr-title">Generate Report</h2>
        <p className="mr-sub">Select a date range to generate an issue report for that period.</p>

        <div className="mr-fields">
          <div className="mr-field">
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-label-icon" />
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select start date"
              dateFormat="dd MMM yyyy"
              className="mr-datepicker"
              maxDate={new Date()}
            />
          </div>

          <div className="mr-field">
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-label-icon" />
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select end date"
              dateFormat="dd MMM yyyy"
              className="mr-datepicker"
              maxDate={new Date()}
            />
          </div>
        </div>

        {error && <p className="mr-error">{error}</p>}

        <button className="mr-btn" onClick={handleGenerate}>
          <FontAwesomeIcon icon={faChartBar} /> Generate Report
        </button>
      </div>
    </div>
  );
};

export default AdminReportPage;
