import nodemailer from 'nodemailer';

import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Tuition App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `
      <h3>OTP Verification</h3>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  
};

export const sendCourseStatusEmail = async (
  to: string,
  courseTitle: string,
  status: 'approved' | 'rejected' | 'pending'
) => {
  const mailOptions = {
    from: `"Tuition App" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Course "${courseTitle}" is now ${status.toUpperCase()}`,
    html: `
      <h3>Course Status Update</h3>
      <p>Your course <strong>${courseTitle}</strong> has been <b>${status.toUpperCase()}</b>.</p>
      <p>If you have questions, please contact support.</p>
    `,
  }
  await transporter.sendMail(mailOptions);
}