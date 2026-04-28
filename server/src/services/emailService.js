const nodemailer = require("nodemailer");

function envValue(name) {
  return String(process.env[name] || "").trim();
}

function isEmailConfigured() {
  return Boolean(
    envValue("OWNER_EMAIL") &&
    (envValue("EMAIL_PASS") || envValue("EMAIL_PASSWORD"))
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: envValue("EMAIL_USER") || envValue("OWNER_EMAIL"),
      pass: envValue("EMAIL_PASS") || envValue("EMAIL_PASSWORD"),
    },
  });
}

async function sendEnquiryNotification(enquiry) {
  if (!isEmailConfigured()) {
    return {
      delivered: false,
      reason: "Email notification is not configured yet.",
    };
  }

  const transporter = createTransporter();
  const ownerEmail = envValue("OWNER_EMAIL");
  const fromEmail = envValue("EMAIL_USER") || envValue("OWNER_EMAIL");
  const submittedAt = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  await transporter.sendMail({
    from: `"Pragathi Wellness Centre Website" <${fromEmail}>`,
    to: ownerEmail,
    replyTo: enquiry.email || fromEmail,
    subject: `New enquiry from ${enquiry.name}`,
    text: [
      "New enquiry received from the website.",
      "",
      `Name: ${enquiry.name}`,
      `Phone: ${enquiry.phone}`,
      `Email: ${enquiry.email || "Not provided"}`,
      `Service: ${enquiry.service || "Not specified"}`,
      `Submitted: ${submittedAt}`,
      "",
      "Message:",
      enquiry.message,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1d2b23;">
        <h2 style="margin-bottom: 12px;">New enquiry received from the website</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Email:</strong> ${enquiry.email || "Not provided"}</p>
        <p><strong>Service:</strong> ${enquiry.service || "Not specified"}</p>
        <p><strong>Submitted:</strong> ${submittedAt}</p>
        <p><strong>Message:</strong></p>
        <p>${String(enquiry.message).replace(/\n/g, "<br>")}</p>
      </div>
    `,
  });

  return {
    delivered: true,
  };
}

module.exports = {
  isEmailConfigured,
  sendEnquiryNotification,
};
