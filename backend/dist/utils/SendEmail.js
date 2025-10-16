"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCourseStatusEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendOtpEmail = (to, otp) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield transporter.sendMail(mailOptions);
});
exports.sendOtpEmail = sendOtpEmail;
const sendCourseStatusEmail = (to, courseTitle, status) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"Tuition App" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Course "${courseTitle}" is now ${status.toUpperCase()}`,
        html: `
      <h3>Course Status Update</h3>
      <p>Your course <strong>${courseTitle}</strong> has been <b>${status.toUpperCase()}</b>.</p>
      <p>If you have questions, please contact support.</p>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendCourseStatusEmail = sendCourseStatusEmail;
