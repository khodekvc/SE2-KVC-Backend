const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const sendEmail = async (to, subject, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Gmail email
                pass: process.env.EMAIL_PASS, // App password (not your actual password)
            },
        });

        let mailOptions = {
            from: `"Your Clinic" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: body,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendEmail };
