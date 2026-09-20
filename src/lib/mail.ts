// Nodemailer is used without bundled TypeScript declarations in this project.
// @ts-expect-error: Nodemailer's runtime module has no installed declaration file.
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;

if (!smtpHost || !smtpUser || !smtpPassword) {
  throw new Error(
    "Missing SMTP configuration. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env."
  );
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? smtpUser,
    to: email,
    subject: "Your Eduvora Verification Code",
    html: `
    <div style="margin:0; padding:40px 20px; background-color:#f4f7fb; font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:520px; margin:0 auto; padding:40px 32px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; text-align:center;">
        <h1 style="margin:0 0 28px; color:#111827; font-size:24px;">Email Verification</h1>
        <div style="display:inline-block; padding:18px 28px; border:2px solid #2563eb; border-radius:10px; background-color:#eff6ff; color:#1d4ed8; font-size:40px; font-weight:700; letter-spacing:10px; line-height:1;">
          ${otp}
        </div>
        <p style="margin:24px 0 0; color:#6b7280; font-size:14px;">This code expires in 10 minutes.</p>
      </div>
    </div>
    `,
  });
}
