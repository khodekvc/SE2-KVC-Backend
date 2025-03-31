const nodemailer = require("nodemailer");
// require("dotenv").config(); 

const sendEmail = async (to, subject, body) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
         console.error("Error sending email: EMAIL_USER or EMAIL_PASS environment variables not set.");
         return; 
    }

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // === Possible TLS fix if you WERE sending real emails ===
            // === but NOT needed for mocked tests!              ===
            // tls: {
            //    rejectUnauthorized: false // Use only for debugging/specific scenarios
            // }
            // =======================================================
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
        // This catch block will now only catch errors from the *mocked* sendMail if it rejects
        console.error("Error sending email:", error);
    }
};

module.exports = { sendEmail };