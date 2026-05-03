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
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Logo bar -->
          <tr>
            <td align="center" style="padding:28px 48px;background:#ffffff;border-bottom:1px solid #e8e8e8;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;padding:8px 14px;border-radius:3px;">
                    <span style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:0.5px;font-family:'Segoe UI',system-ui,sans-serif;">FLOW</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="font-size:15px;font-weight:400;color:#1e2235;letter-spacing:1px;font-family:'Segoe UI',system-ui,sans-serif;">BASE</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dark hero -->
          <tr>
            <td align="center" style="background:#1e2235;padding:48px 48px 40px;">
              <!-- Lock icon -->
              <div style="width:64px;height:64px;border:2px solid rgba(255,255,255,0.3);border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
                <table cellpadding="0" cellspacing="0" width="64" height="64" style="border:2px solid rgba(255,255,255,0.3);border-radius:32px;">
                  <tr>
                    <td align="center" valign="middle" style="font-size:26px;line-height:1;">
                      &#128274;
                    </td>
                  </tr>
                </table>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:0.2px;font-family:'Segoe UI',system-ui,sans-serif;">
                Welcome to Flowbase, ${safeName}!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <p style="margin:0 0 12px;font-size:15px;color:#444444;line-height:1.7;">Hello ${safeName},</p>
              <p style="margin:0 0 12px;font-size:15px;color:#444444;line-height:1.7;">
                Your Flowbase account is ready. You can now build visual workflows, connect your tools, and run automations — no self-hosting, no bloat.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#444444;line-height:1.7;">
                Click below to open your dashboard and create your first workflow:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;border-radius:3px;">
                    <a href="https://flow-base.dev/workflows"
                       style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.3px;font-family:'Segoe UI',system-ui,sans-serif;">
                      Start Building
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:13px;color:#999999;font-style:italic;line-height:1.6;">
                If you did not create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1e2235;padding:28px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#ffffff;">Contact</p>
                    <p style="margin:0;font-size:12px;color:#8b93a8;line-height:1.6;">
                      flow-base.dev<br/>
                      support@flow-base.dev
                    </p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-left:10px;">
                          <a href="https://twitter.com/flowbase" style="display:inline-block;width:32px;height:32px;background:rgba(255,255,255,0.1);border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">𝕏</a>
                        </td>
                        <td style="padding-left:10px;">
                          <a href="https://github.com/flowbase" style="display:inline-block;width:32px;height:32px;background:rgba(255,255,255,0.1);border-radius:50%;text-align:center;line-height:32px;text-decoration:none;font-size:14px;color:#ffffff;">⌥</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:8px 0 0;font-size:11px;color:#8b93a8;text-align:right;">Flowbase © All Rights Reserved</p>
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
