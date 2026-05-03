import { Resend } from 'resend';

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
    from: 'Flowbase <noreply@flow-base.dev>',
    to,
    subject,
    html,
  });
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Welcome to Flowbase</title>
</head>
<body style="margin:0;padding:0;background:#0f0f11;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f11;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;overflow:hidden;border:1px solid #27272a;">

          <!-- Header -->
          <tr>
            <td style="background:#18181b;padding:40px 48px 32px;border-bottom:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                      flow<span style="color:oklch(71.62% 0.1597 290)">base</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#fafafa;letter-spacing:-0.5px;">
                Hey ${name}, you're in. 🚀
              </h1>
              <p style="margin:0 0 24px;font-size:16px;color:#a1a1aa;line-height:1.6;">
                Welcome to Flowbase — the visual workflow builder built for developers who
                hate clicking through bloated dashboards.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#09090b;border:1px solid #27272a;border-radius:8px;padding:20px 24px;">
                    <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.08em;">
                      What you can do now
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:oklch(71.62% 0.1597 290);font-size:14px;margin-right:10px;">→</span>
                          <span style="color:#d4d4d8;font-size:14px;">Build workflows visually on an infinite canvas</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:oklch(71.62% 0.1597 290);font-size:14px;margin-right:10px;">→</span>
                          <span style="color:#d4d4d8;font-size:14px;">Connect your tools with pre-built integrations</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:oklch(71.62% 0.1597 290);font-size:14px;margin-right:10px;">→</span>
                          <span style="color:#d4d4d8;font-size:14px;">Run and debug executions in real-time</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:oklch(54.17% 0.179 288);border-radius:8px;">
                    <a href="https://flow-base.dev/workflows"
                       style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                      Start building →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #27272a;">
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
                You're receiving this because you just created a Flowbase account.<br/>
                Questions? Reply to this email — a real human reads it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({ to, subject: "Welcome to Flowbase 🚀", html });
};