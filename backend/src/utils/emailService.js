const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Extreme Service Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#1a237e">Extreme Service Delivery Portal</h2>
        <p>Your one-time verification code is:</p>
        <h1 style="letter-spacing:8px;color:#1565c0">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: `"Extreme Service Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#1a237e">Password Reset</h2>
        <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetLink}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#1565c0;color:#fff;border-radius:6px;text-decoration:none">Reset Password</a>
        <p style="margin-top:16px;color:#666;font-size:13px">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

const sendEmployeeAccountEmail = async (email, name, password, role) => {
  await transporter.sendMail({
    from: `"Extreme Service Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Municipal Employee Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#1a237e">Welcome, ${name}!</h2>
        <p>Your <strong>${role}</strong> account has been created on the Extreme Service Delivery Portal.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> ${password}</p>
        <p style="color:#e53935">Please log in and change your password as soon as possible.</p>
      </div>
    `,
  });
};

const sendReportEmail = async (toEmail, fromName, title, message) => {
  await transporter.sendMail({
    from: `"Extreme Service Portal" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Supervisor Report: ${title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
        <h2 style="color:#1b4332">Supervisor Report</h2>
        <p><strong>From:</strong> ${fromName}</p>
        <p><strong>Title:</strong> ${title}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p style="white-space:pre-wrap;color:#333">${message}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p style="font-size:12px;color:#999">Sent via Extreme Service Delivery Portal</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail, sendPasswordResetEmail, sendEmployeeAccountEmail, sendReportEmail };
