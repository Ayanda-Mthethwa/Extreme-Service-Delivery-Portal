import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft,faBell,faCircleInfo,faArrowUpAZ,} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Card from "react-bootstrap/Card";
import "bootstrap-icons/font/bootstrap-icons.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { mediaUrl } from "../../../services/api";
import { assignSupervisor } from "../../../services/issueService";
import useDeptIssues from '../../../hooks/useDeptIssues';
import { getSupervisors } from "../../../services/supervisorService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PdfReport = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const { issues: originalIssues } = useDeptIssues();
  const [supervisors, setSupervisors] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [notifications, setNotifications] = useState([]);


  const notify = () => {
    toast("Supervisor assigned successfully!", {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "manager-custom-toast",
    });
  };

  const getImageUrl = (path) => mediaUrl(path);

  useEffect(() => {
    getSupervisors()
      .then(res => setSupervisors(res.data))
      .catch(err => console.error("Error fetching supervisors:", err));
  }, []);

  useEffect(() => {
    let updatedIssues = [...originalIssues];

    // Apply filtering
    if (filterBy) {
      switch (filterBy) {
        case "Location":
          updatedIssues = updatedIssues.filter(
            (issue) => issue.location === "specific location"
          );
          break;
        case "Date":
          updatedIssues = updatedIssues.filter(
            (issue) => issue.date_reported === "specific date"
          );
          break;
        case "Status":
          updatedIssues = updatedIssues.filter(
            (issue) => issue.status === "specific status"
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "Location":
          updatedIssues.sort((a, b) => a.location.localeCompare(b.location));
          break;
        case "Date":
          updatedIssues.sort(
            (a, b) => new Date(a.date_reported) - new Date(b.date_reported)
          );
          break;
        case "Status":
          updatedIssues.sort((a, b) => a.status.localeCompare(b.status));
          break;
        default:
          break;
      }
    }

    setIssues(updatedIssues);
  }, [sortBy, filterBy, originalIssues]);

  const handleSort = (criteria) => {
    setSortBy(criteria);
  };

  const handleFilter = (criteria) => {
    setFilterBy(criteria);
  };

  const createNotification = (message, supervisorID) => {
    const newNotification = {
      id: notifications.length + 1,
      message,
      supervisorID,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const handleAssignSupervisor = async (issueID, supervisorID) => {
    try {
      const response = await assignSupervisor(issueID, supervisorID);
  
      if (response.status === 200) {
        notify();
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue.issue_id === issueID
              ? { ...issue, supervisor_id: supervisorID }
              : issue
          )
        );
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to assign supervisor, please try again.');
    }
  };
  


  const generatePdf = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("report.pdf");
    });
  };


  const toggleSection = (issue) => {
    setSelectedIssue(issue);
    setIsActive(!isActive);
  };

  const renderNotifications = () => {
    return notifications.map((notification) => (
      <div key={notification.id} className="notification">
        <p>{notification.message}</p>
        <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
      </div>
    ));
  };

  return (
    <>
      <div className="issues-page">

        <span className="overlay" onClick={toggleSection}></span>

        <header className="issues-header">
          <Link to="/landing">
            <FontAwesomeIcon icon={faArrowLeft} className="back-landing" />
          </Link>
          <h1 className="reported-header">REPORTED ISSUES</h1>
          <Button
            onClick={generatePdf}
            className="btn save-button"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Download Report"
          >
            <i className="bi bi-file-earmark-arrow-down-fill"></i>
          </Button>
        </header>

        <div className="filt-sort">
          <span className="issues-count">{issues.length} issue{issues.length !== 1 ? 's' : ''} found</span>
          <DropdownButton title={<><FontAwesomeIcon icon={faArrowUpAZ} /> Sort By</>} className="btn sorting btn-lg">
            <Dropdown.Item onClick={() => handleSort("Location")}>Location</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort("Date")}>Date</Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort("Status")}>Status</Dropdown.Item>
          </DropdownButton>
        </div>

        <div id="pdf-content">
          {issues.map((issue, index) => {
            const statusClass = (issue.status || '').toLowerCase().replace(/\s+/g, '-');
            const assignedSup = supervisors.find(s => s.id === issue.supervisor_id);
            return (
              <Card key={index} className="report-sec">
                <Card.Body>
                  <div className="card-left">
                    <span className={`issue-status-badge ${statusClass}`}>{issue.status || 'Pending'}</span>
                    <div className="issue-meta">
                      <div className="issue-paragraph"><strong>Issue Type:</strong> {issue.issue_category || '—'}</div>
                      <div className="issue-paragraph"><strong>Date Reported:</strong> {new Date(issue.date_reported).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}</div>
                      <div className="issue-paragraph"><strong>Location:</strong> {issue.location || '—'}</div>
                      {assignedSup && (
                        <div className="issue-paragraph"><strong>Supervisor:</strong> {assignedSup.name} {assignedSup.surname || ''}</div>
                      )}
                    </div>
                  </div>
                  <div className="card-actions">
                    {!issue.supervisor_id ? (
                      <DropdownButton title="Assign" className="btn assign-btn">
                        {supervisors.map((supervisor) => (
                          <Dropdown.Item
                            key={supervisor.id}
                            onClick={() => handleAssignSupervisor(issue.issue_id, supervisor.id)}
                          >
                            {supervisor.name} {supervisor.surname}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    ) : (
                      <Button className="btn assigned-btn" variant="secondary" disabled>Assigned</Button>
                    )}
                    <Button className="btn details-btn" onClick={() => toggleSection(issue)}>Details</Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>

        {isActive && selectedIssue && (
          <section className={`modal ${isActive ? "active" : ""}`}>
            <div className="pop-up-box">
              <FontAwesomeIcon icon={faCircleInfo} className="pop-up-icon" />
              <h2>DETAILS</h2>
              <div><strong> Issue Type: </strong>{selectedIssue.issue_category}</div>
              <div><strong>Issue Description:</strong> {selectedIssue.description}</div>

              <div><strong>Issue Image: </strong><br/>{selectedIssue.issue_image_path ? ( 
                  <img className="issue-image-pop-up" src={getImageUrl(selectedIssue.issue_image_path)} alt="issue"/>
              ) : <p>No image available</p>}</div>

              <div className="button-sec">
                <Button
                  className="btn close-btn"
                  onClick={() => toggleSection(null)}
                >
                  Ok, Close
                </Button>
              </div>
            </div>
          </section>
        )}

        <div className="notifications">{renderNotifications()}</div>
      </div>
    </>
  );
};

export default PdfReport;
