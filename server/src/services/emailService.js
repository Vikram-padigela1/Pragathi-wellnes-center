const nodemailer = require("nodemailer");

function envValue(name) {
  return String(process.env[name] || "").trim();
}

function isEmailConfigured() {
  return Boolean(
    envValue("OWNER_NOTIFICATION_EMAIL") &&
    envValue("SMTP_HOST") &&
    envValue("SMTP_PORT") &&
    envValue("SMTP_USER") &&
    envValue("SMTP_PASS")
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: envValue("SMTP_HOST"),
    port: Number.parseInt(envValue("SMTP_PORT") || "465", 10),
    secure: envValue("SMTP_SECURE") === "false" ? false : true,
    auth: {
      user: envValue("SMTP_USER"),
      pass: envValue("SMTP_PASS"),
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
  const ownerEmail = envValue("OWNER_NOTIFICATION_EMAIL");
  const fromEmail = envValue("SMTP_FROM") || envValue("SMTP_USER");
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
