// Nodemailer is used without bundled TypeScript declarations in this project.

// @ts-expect-error: Nodemailer's runtime module has no installed declaration file.
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 465);
const smtpUser = process.env.SMTP_USER;
const smtpPassword =
  process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;

if (!smtpHost || !smtpUser || !smtpPassword) {
  throw new Error(
    "Missing SMTP configuration. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env.",
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

type OtpEmailType = "verification" | "password-reset";

export async function sendOtpEmail(
  email: string,
  otp: string,
  type: OtpEmailType = "verification",
) {
  const isPasswordReset = type === "password-reset";

  const subject = isPasswordReset
    ? "Reset Your Eduvora Password"
    : "Verify Your Eduvora Account";

  const heading = isPasswordReset
    ? "Password Reset Request"
    : "Verify Your Email";

  const description = isPasswordReset
    ? "Use the verification code below to reset your Eduvora account password."
    : "Use the verification code below to verify your Eduvora account.";

  const footerText = isPasswordReset
    ? "If you did not request a password reset, you can safely ignore this email."
    : "If you did not create an Eduvora account, you can safely ignore this email.";

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? smtpUser,
    to: email,
    subject,

    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>${subject}</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background-color:#f5f7fb;
            font-family:Arial,Helvetica,sans-serif;
            color:#111827;
          "
        >

          <div
            style="
              width:100%;
              padding:40px 16px;
              box-sizing:border-box;
            "
          >

            <!-- Main Card -->
            <div
              style="
                max-width:520px;
                margin:0 auto;
                background-color:#ffffff;
                border:1px solid #e5e7eb;
                border-radius:18px;
                overflow:hidden;
              "
            >

              <!-- Header -->
              <div
                style="
                  padding:28px 30px;
                  text-align:center;
                  border-bottom:1px solid #f0f0f0;
                "
              >
                <div
                  style="
                    display:inline-block;
                    margin-bottom:12px;
                    padding:7px 12px;
                    border-radius:999px;
                    background-color:${
                      isPasswordReset ? "#eef2ff" : "#ecfdf5"
                    };
                    color:${
                      isPasswordReset ? "#4f46e5" : "#059669"
                    };
                    font-size:12px;
                    font-weight:700;
                    letter-spacing:0.4px;
                  "
                >
                  Eduvora
                </div>

                <h1
                  style="
                    margin:0;
                    font-size:24px;
                    line-height:32px;
                    font-weight:700;
                    color:#111827;
                  "
                >
                  ${heading}
                </h1>
              </div>

              <!-- Content -->
              <div
                style="
                  padding:32px 30px;
                  text-align:center;
                "
              >

                <p
                  style="
                    margin:0 auto 24px;
                    max-width:420px;
                    font-size:14px;
                    line-height:22px;
                    color:#6b7280;
                  "
                >
                  ${description}
                </p>

                <!-- OTP -->
                <div
                  style="
                    display:inline-block;
                    padding:16px 24px;
                    border:2px solid ${
                      isPasswordReset ? "#6366f1" : "#10b981"
                    };
                    border-radius:12px;
                    background-color:${
                      isPasswordReset ? "#eef2ff" : "#ecfdf5"
                    };
                    color:${
                      isPasswordReset ? "#4338ca" : "#047857"
                    };
                    font-size:34px;
                    line-height:40px;
                    font-weight:700;
                    letter-spacing:8px;
                  "
                >
                  ${otp}
                </div>

                <p
                  style="
                    margin:20px 0 0;
                    font-size:13px;
                    line-height:20px;
                    color:#9ca3af;
                  "
                >
                  This code expires in <strong>10 minutes</strong>.
                </p>

                <!-- Security Notice -->
                <div
                  style="
                    margin-top:28px;
                    padding:14px 16px;
                    border-radius:10px;
                    background-color:#f9fafb;
                    border:1px solid #f3f4f6;
                    text-align:left;
                  "
                >
                  <p
                    style="
                      margin:0;
                      font-size:12px;
                      line-height:19px;
                      color:#6b7280;
                    "
                  >
                    ${footerText}
                  </p>
                </div>

              </div>

              <!-- Footer -->
              <div
                style="
                  padding:18px 24px;
                  text-align:center;
                  background-color:#f9fafb;
                  border-top:1px solid #f0f0f0;
                "
              >
                <p
                  style="
                    margin:0;
                    font-size:11px;
                    line-height:18px;
                    color:#9ca3af;
                  "
                >
                  © ${new Date().getFullYear()} Eduvora · AI-powered career
                  guidance for students
                </p>
              </div>

            </div>

          </div>

        </body>
      </html>
    `,
  });
}