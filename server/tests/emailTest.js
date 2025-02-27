const { sendEmail } = require("../utils/emailUtility");

const recipient = "gallardo.sheimariz@gmail.com";
const subject = "Email Kho";
const body = "Mic test mic test.";

sendEmail(recipient, subject, body)
    .then(() => console.log("Email sent successfully to " + recipient))
    .catch((error) => console.error("Failed to send email:", error));
