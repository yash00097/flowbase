import { createHash, randomInt } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { sendForgotOtpEmail } from "@/lib/email";

const schema = z.object({ email: z.email() });

const generateOtp = () => String(100000 + randomInt(900000));
const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  // Don't reveal whether the email exists
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const hasCredential = user.accounts.some(
    (a) => a.providerId === "credential",
  );
  const hasSocial = user.accounts.some(
    (a) => a.providerId === "google" || a.providerId === "github",
  );

  if (hasSocial && !hasCredential) {
    return NextResponse.json(
      {
        error:
          "This email is linked to a social login. Use Google or GitHub to sign in.",
      },
      { status: 400 },
    );
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Invalidate previous unused tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  await prisma.passwordResetToken.create({
    data: {
      email,
      token: hashOtp(otp),
      expiresAt,
    },
  });

  await sendForgotOtpEmail(email, otp);

  return NextResponse.json({ ok: true });
}
