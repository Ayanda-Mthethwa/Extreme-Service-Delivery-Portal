import React, { useState } from 'react';
import { submitReport } from '../../../services/reportService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faHeading, faAlignLeft, faUserTie } from '@fortawesome/free-solid-svg-icons';
import '../../../scss/Supervisor/writereport.scss';

const ReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await submitReport(form);
      navigate('/SubmittedReport', { state: { message: res.data.message } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="writereport-page">
      <div className="writereport-card">
        <button className="back-btn" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>

        <div className="writereport-header">
          <h2>Write Report</h2>
          <p>Fill in the form below to submit your report</p>
        </div>

        <div className="report-recipient-info">
          <FontAwesomeIcon icon={faUserTie} />
          <span>This report will be sent directly to your <strong>department manager</strong></span>
        </div>

        {error && <div className="report-error">{error}</div>}

        <form onSubmit={handleSubmit} className="writereport-form">
          <div className="form-group">
            <label>Title</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faHeading} className="input-icon" />
              <input
                type="text"
                name="title"
                placeholder="Enter report title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Message</label>
            <div className="textarea-wrapper">
              <FontAwesomeIcon icon={faAlignLeft} className="input-icon textarea-icon" />
              <textarea
                name="message"
                placeholder="Write your report message here..."
                rows="6"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="send-btn" disabled={loading}>
            <FontAwesomeIcon icon={faPaperPlane} />
            {loading ? ' Sending...' : ' Send Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
