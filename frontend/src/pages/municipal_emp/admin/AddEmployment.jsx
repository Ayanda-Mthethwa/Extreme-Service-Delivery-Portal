import React, { useState, useRef, useEffect } from "react";
import "../../../scss/Admin/addemployee.scss";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { registerEmployee, registerAdmin } from "../../../services/authService";
import { getDepartments } from "../../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faUser, faEnvelope, faLock, faEye, faEyeSlash,
  faPhone, faLocationDot, faIdCard, faBuilding, faBriefcase,
  faUserShield, faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const Forms = () => {
  const manager = useRef();
  const admin = useRef();
  const [activeForm, setActiveForm] = useState("admin");
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSwitch = (formType) => {
    setActiveForm(formType);
    setFormError("");
    setShowPassword(false);
  };

  useEffect(() => {
    getDepartments()
      .then((res) => setDepartments(res.data))
      .catch((err) => setFormError(err.response?.data?.message || "Failed to load departments."));
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_jiykck6", "template_awzyeea", manager.current, {
      publicKey: "m2x_uR6CdDFeKNKZW",
    }).then(() => console.log("Email sent successfully!"),
      (err) => console.log("Email sending failed...", err.text));

    const data = Object.fromEntries(new FormData(e.target));
    registerEmployee(data)
      .then(() => navigate("/adminhome"))
      .catch(() => setFormError("Error submitting the form. Please try again."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_jiykck6", "template_awzyeea", admin.current, {
      publicKey: "m2x_uR6CdDFeKNKZW",
    }).then(() => console.log("Email sent successfully!"),
      (err) => console.log("Email sending failed...", err.text));

    const data = Object.fromEntries(new FormData(e.target));
    registerAdmin(data)
      .then(() => navigate("/adminhome"))
      .catch(() => setFormError("Error submitting the form. Please try again."));
  };

  return (
    <div className="ae-page">

      <button className="ae-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="ae-card">

        <div className="ae-header">
          <h2>Employee Management</h2>
          <p>Register a new admin or add a manager / supervisor to a department</p>
        </div>

        {/* Tab switcher */}
        <div className="ae-tabs">
          <button
            className={`ae-tab ${activeForm === "admin" ? "active" : ""}`}
            onClick={() => handleFormSwitch("admin")}
          >
            <FontAwesomeIcon icon={faUserShield} /> Admin
          </button>
          <button
            className={`ae-tab ${activeForm === "employee" ? "active" : ""}`}
            onClick={() => handleFormSwitch("employee")}
          >
            <FontAwesomeIcon icon={faUserTie} /> Add Employee
          </button>
        </div>

        {formError && <p className="ae-error">{formError}</p>}

        {/* ── Admin Form ── */}
        {activeForm === "admin" && (
          <form ref={admin} id="admin-forms" onSubmit={handleSubmit} className="ae-form" autoComplete="off">
            <h3 className="ae-form-title">New Admin Account</h3>

            <div className="ae-field">
              <label>Full Name</label>
              <div className="ae-input-wrap">
                <FontAwesomeIcon icon={faUser} className="ae-icon" />
                <input type="text" name="name" placeholder="Full name" autoComplete="off" required />
              </div>
            </div>

            <div className="ae-field">
              <label>Email Address</label>
              <div className="ae-input-wrap">
                <FontAwesomeIcon icon={faEnvelope} className="ae-icon" />
                <input type="email" name="email" placeholder="admin@example.com" autoComplete="off" required />
              </div>
            </div>

            <div className="ae-field">
              <label>Password</label>
              <div className="ae-input-wrap">
                <FontAwesomeIcon icon={faLock} className="ae-icon" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Set a password" autoComplete="new-password" required />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="ae-eye"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <button type="submit" className="ae-btn">Register Admin</button>
          </form>
        )}

        {/* ── Add Employee Form ── */}
        {activeForm === "employee" && (
          <form ref={manager} id="manager-form" onSubmit={handleFormSubmit} className="ae-form" autoComplete="off">
            <h3 className="ae-form-title">New Employee Account</h3>

            <div className="ae-grid-2">
              <div className="ae-field">
                <label>Employee ID</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faIdCard} className="ae-icon" />
                  <input type="text" name="empID" placeholder="Employee ID" autoComplete="off" required />
                </div>
              </div>
              <div className="ae-field">
                <label>Role</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faBriefcase} className="ae-icon" />
                  <select name="role" required defaultValue="">
                    <option value="" disabled hidden>Select role</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SUPERVISOR">Supervisor</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ae-grid-2">
              <div className="ae-field">
                <label>First Name</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faUser} className="ae-icon" />
                  <input type="text" name="name" placeholder="First name" autoComplete="off" required />
                </div>
              </div>
              <div className="ae-field">
                <label>Surname</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faUser} className="ae-icon" />
                  <input type="text" name="surname" placeholder="Surname" autoComplete="off" required />
                </div>
              </div>
            </div>

            <div className="ae-grid-2">
              <div className="ae-field">
                <label>Email Address</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faEnvelope} className="ae-icon" />
                  <input type="email" name="email" placeholder="Email address" autoComplete="off" required />
                </div>
              </div>
              <div className="ae-field">
                <label>Contact Number</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faPhone} className="ae-icon" />
                  <input type="text" name="contact" placeholder="Contact number" autoComplete="off" required />
                </div>
              </div>
            </div>

            <div className="ae-grid-2">
              <div className="ae-field">
                <label>Department</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faBuilding} className="ae-icon" />
                  <select
                    name="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ae-field">
                <label>Address</label>
                <div className="ae-input-wrap">
                  <FontAwesomeIcon icon={faLocationDot} className="ae-icon" />
                  <input type="text" name="address" placeholder="Address" autoComplete="off" required />
                </div>
              </div>
            </div>

            <div className="ae-field">
              <label>Password</label>
              <div className="ae-input-wrap">
                <FontAwesomeIcon icon={faLock} className="ae-icon" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Set a password" autoComplete="new-password" required />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="ae-eye"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <button type="submit" className="ae-btn">Add Employee</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Forms;
