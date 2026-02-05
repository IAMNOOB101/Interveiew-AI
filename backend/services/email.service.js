import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendInterviewCompletionEmail = async ({
  to,
  name,
  sessionId,
  performanceCategory
}) => {
  await transporter.sendMail({
    from: `"InterviewAI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your InterviewAI interview is complete 🎉",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>Your interview has been successfully completed.</p>
      <p><strong>Overall Performance:</strong> ${performanceCategory}</p>
      <p>You can view your transcript and insights anytime:</p>
      <p>
        <a href="${process.env.CLIENT_URL}/history/${sessionId}">
          View Interview Transcript
        </a>
      </p>
      <br/>
      <p>– Team InterviewAI</p>
    `
  });
};
