import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import '../../../scss/Admin/monthlydetail.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faCircleCheck, faClock, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { getReports } from '../../../services/reportService';

const IssueDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startDate, endDate, reports: passedReports } = location.state || {};
  const [reports, setReports] = useState(Array.isArray(passedReports) ? passedReports : []);

  useEffect(() => {
    if (!passedReports) {
      const fetchReports = async () => {
        try {
          const response = await getReports(startDate, endDate);
          setReports(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      };
      fetchReports();
    }
  }, [startDate, endDate]);

  const pending = reports.filter(r => r.status === 'Pending' || r.status === 'In Progress');
  const completed = reports.filter(r => r.status === 'Completed');

  const getStatusClass = (status = '') =>
    status.toLowerCase().replace(/\s+/g, '-');

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 14;

    doc.setFontSize(18);
    doc.text('Extreme Service Delivery — Issue Report', 10, y); y += 10;
    doc.setFontSize(12);
    doc.text(`Period: ${startDate || '—'} to ${endDate || '—'}`, 10, y); y += 7;
    doc.text(`Total: ${reports.length}  |  Pending/In Progress: ${pending.length}  |  Completed: ${completed.length}`, 10, y); y += 12;

    doc.setFontSize(14);
    doc.text('All Issues:', 10, y); y += 8;
    doc.setFontSize(10);

    reports.forEach((r, i) => {
      const line = `${i + 1}. [${r.issue_category || '—'}] ${r.description || '—'} — ${r.location || '—'} (${r.status || '—'})`;
      const split = doc.splitTextToSize(line, 185);
      doc.text(split, 10, y);
      y += split.length * 6;
      if (y > 270) { doc.addPage(); y = 10; }
    });

    doc.save(`report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="md-page">
      <button className="md-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="md-container">

        <div className="md-header">
          <div>
            <h1 className="md-title">Issue Report</h1>
            <p className="md-period">
              {startDate || '—'} &mdash; {endDate || '—'}
            </p>
          </div>
          <button className="md-download-btn" onClick={handleDownloadPDF}>
            <FontAwesomeIcon icon={faDownload} /> Download PDF
          </button>
        </div>

        <div className="md-stats">
          <div className="md-stat">
            <FontAwesomeIcon icon={faClipboardList} className="md-stat-icon total" />
            <span className="md-stat-num">{reports.length}</span>
            <span className="md-stat-label">Total Issues</span>
          </div>
          <div className="md-stat">
            <FontAwesomeIcon icon={faClock} className="md-stat-icon pending" />
            <span className="md-stat-num">{pending.length}</span>
            <span className="md-stat-label">Pending / In Progress</span>
          </div>
          <div className="md-stat">
            <FontAwesomeIcon icon={faCircleCheck} className="md-stat-icon completed" />
            <span className="md-stat-num">{completed.length}</span>
            <span className="md-stat-label">Completed</span>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="md-empty">No issues found for this date range.</div>
        ) : (
          <div className="md-table-wrap">
            <table className="md-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Date Reported</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{r.issue_category || '—'}</td>
                    <td>{r.description || '—'}</td>
                    <td>{r.location || '—'}</td>
                    <td>
                      {r.date_reported
                        ? new Date(r.date_reported).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td>
                      <span className={`md-badge ${getStatusClass(r.status)}`}>
                        {r.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default IssueDetail;
