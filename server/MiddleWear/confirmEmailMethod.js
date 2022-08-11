const sgMail = require("@sendgrid/mail");

function sendEmail(dest, message) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: dest, // Change to your recipient
      from: process.env.senderEmail, // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: message,
    };
    (async () => {
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    })();
  } catch (error) {
    console.error("catch error from send Email", error);
  }
}

module.exports = sendEmail;
