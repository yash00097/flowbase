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

export const sendForgotOtpEmail = async (to: string, otp: string) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Reset your Flowbase password</title>
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
                Reset your password
              </h1>
              <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;">
                Use the code below to reset your Flowbase password. It expires in 15 minutes.
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

          <!-- OTP Block -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#555555;line-height:1.7;">
                Your one-time code:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;border-radius:6px;padding:16px 36px;">
                    <span style="font-size:32px;font-weight:700;color:#ffffff;letter-spacing:10px;font-family:'Courier New',monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#aaaaaa;line-height:1.6;">
                If you didn't request a password reset, you can safely ignore this email.
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

  return sendEmail({ to, subject: "Reset your Flowbase password", html });
};

export const sendSignupOtpEmail = async (to: string, otp: string) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Verify your Flowbase email</title>
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
                Verify your email
              </h1>
              <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;">
                Use the code below to finish creating your Flowbase account. It expires in 15 minutes.
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

          <!-- OTP Block -->
          <tr>
            <td style="padding:24px 32px 32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#555555;line-height:1.7;">
                Your one-time code:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;border-radius:6px;padding:16px 36px;">
                    <span style="font-size:32px;font-weight:700;color:#ffffff;letter-spacing:10px;font-family:'Courier New',monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#aaaaaa;line-height:1.6;">
                If you didn't try to sign up for Flowbase, you can safely ignore this email.
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

  return sendEmail({ to, subject: "Verify your Flowbase email", html });
};

export const sendExecutionEmail = async (params: {
  to: string;
  workflowName: string;
  workflowId: string;
  executionId: string;
  status: "SUCCESS" | "FAILED";
  startedAt: Date;
  completedAt: Date | null;
  durationSeconds: number | null;
  eventId: string;
  error?: string | null;
  errorStack?: string | null;
  output?: unknown;
}) => {
  const {
    to,
    workflowName,
    workflowId,
    executionId,
    status,
    startedAt,
    completedAt,
    durationSeconds,
    eventId,
    error,
    errorStack,
    output,
  } = params;

  const truncate = (s: string, max: number) =>
    s.length > max
      ? `${s.slice(0, max)}\n…[truncated ${s.length - max} chars]`
      : s;

  const safeStringify = (value: unknown): string => {
    try {
      return JSON.stringify(
        value,
        (_k, v) => (typeof v === "bigint" ? v.toString() : v),
        2,
      );
    } catch {
      return "[unserializable output]";
    }
  };

  const safeWorkflow = escapeHtml(workflowName);
  const isSuccess = status === "SUCCESS";
  const statusLabel = isSuccess ? "Success" : "Failed";
  const statusColor = isSuccess ? "#16a34a" : "#dc2626";
  const statusBg = isSuccess ? "#ecfdf5" : "#fef2f2";

  const startedStr = escapeHtml(startedAt.toISOString());
  const completedStr = completedAt
    ? escapeHtml(completedAt.toISOString())
    : "—";
  const durationStr = durationSeconds !== null ? `${durationSeconds}s` : "—";
  const safeEventId = escapeHtml(eventId);

  const errorBlock = error
    ? `
          <tr>
            <td style="padding:0 32px 8px;">
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:16px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#991b1b;">Error</p>
                <p style="margin:0;font-size:13px;color:#7f1d1d;font-family:'Courier New',monospace;word-break:break-word;">${escapeHtml(error)}</p>
                ${
                  errorStack
                    ? `<pre style="margin:12px 0 0;padding:12px;background:#fee2e2;border-radius:4px;font-size:11px;color:#7f1d1d;overflow:auto;white-space:pre-wrap;">${escapeHtml(truncate(errorStack, 8_000))}</pre>`
                    : ""
                }
              </div>
            </td>
          </tr>`
    : "";

  const outputJson =
    output !== undefined && output !== null
      ? escapeHtml(truncate(safeStringify(output), 16_000))
      : null;

  const outputBlock = outputJson
    ? `
          <tr>
            <td style="padding:0 32px 8px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1e2235;">Output</p>
              <pre style="margin:0;padding:14px;background:#f8f9fb;border:1px solid #e8e8e8;border-radius:6px;font-size:12px;color:#1e2235;font-family:'Courier New',monospace;overflow:auto;white-space:pre-wrap;">${outputJson}</pre>
            </td>
          </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Workflow execution ${statusLabel.toLowerCase()}</title>
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
            <td style="padding:32px 32px 8px;">
              <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${statusBg};color:${statusColor};font-size:12px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;">
                ${statusLabel}
              </span>
              <h1 style="margin:14px 0 8px;font-size:22px;font-weight:700;color:#1e2235;line-height:1.3;">
                ${safeWorkflow}
              </h1>
              <p style="margin:0;font-size:14px;color:#555555;line-height:1.6;">
                Execution ${isSuccess ? "completed successfully" : "failed"}.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="border-top:1px solid #e8e8e8;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Field grid -->
          <tr>
            <td style="padding:20px 32px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#1e2235;">
                <tr>
                  <td style="padding:6px 0;width:40%;color:#888;">Workflow</td>
                  <td style="padding:6px 0;">${safeWorkflow}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#888;">Status</td>
                  <td style="padding:6px 0;">${statusLabel}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#888;">Started</td>
                  <td style="padding:6px 0;">${startedStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#888;">Completed</td>
                  <td style="padding:6px 0;">${completedStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#888;">Duration</td>
                  <td style="padding:6px 0;">${durationStr}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#888;">Event ID</td>
                  <td style="padding:6px 0;font-family:'Courier New',monospace;">${safeEventId}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${errorBlock}
          ${outputBlock}

          <!-- CTA -->
          <tr>
            <td style="padding:16px 32px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1e2235;border-radius:6px;">
                    <a href="https://flow-base.dev/executions/${executionId}"
                       style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;font-family:'Segoe UI',system-ui,sans-serif;">
                      View execution →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:12px;color:#aaaaaa;">Workflow ID: ${escapeHtml(workflowId)}</p>
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

  return sendEmail({
    to,
    subject: `Workflow ${isSuccess ? "succeeded" : "failed"}: ${workflowName}`,
    html,
  });
};
