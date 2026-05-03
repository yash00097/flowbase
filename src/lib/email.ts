import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return resend.emails.send({
    from: "Flowbase <noreply@flow-base.dev>",
    to,
    subject,
    html,
  });
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const sendWelcomeEmail = async (to: string, name: string) => {
  const safeName = escapeHtml(name);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Welcome to Flowbase</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header: Logo + Name -->
          <tr>
            <td align="left" style="padding:20px 32px;background:#ffffff;border-bottom:1px solid #e8e8e8;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="https://flow-base.dev/logos/logo.png"
                         alt="Flowbase Logo"
                         width="28" height="28"
                         style="display:block;border:0;" />
                  </td>
                  <td style="padding-left:8px;vertical-align:middle;">
                    <span style="font-size:16px;font-weight:700;color:#1e2235;letter-spacing:0.3px;font-family:'Segoe UI',system-ui,sans-serif;">
                      Flowbase
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:40px 32px 8px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1e2235;line-height:1.3;">
                Welcome, ${safeName} 👋
              </h1>
              <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;">
                Your Flowbase account is ready. Build visual workflows, connect your tools, and run automations — no self-hosting, no bloat.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e8e8e8;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#555555;line-height:1.7;">
                Click below to open your dashboard and create your first workflow:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;border-radius:6px;">
                    <a href="https://flow-base.dev/workflows"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;font-family:'Segoe UI',system-ui,sans-serif;">
                      Open Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#aaaaaa;line-height:1.6;">
                If you didn't create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f8f9fb;border-top:1px solid #e8e8e8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.7;">
                      Flowbase · <a href="https://flow-base.dev" style="color:#aaaaaa;text-decoration:none;">flow-base.dev</a> · <a href="mailto:support@flow-base.dev" style="color:#aaaaaa;text-decoration:none;">support@flow-base.dev</a>
                    </p>
                    <p style="margin:4px 0 0;font-size:11px;color:#cccccc;">© Flowbase. All rights reserved.</p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <a href="https://github.com/flowbase" style="display:inline-block;width:28px;height:28px;background:#e8e8e8;border-radius:50%;text-align:center;line-height:28px;text-decoration:none;font-size:12px;color:#555555;margin-left:6px;">⌥</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({ to, subject: "Welcome to Flowbase", html });
};
