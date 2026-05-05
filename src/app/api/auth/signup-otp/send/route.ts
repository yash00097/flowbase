import { createHash, randomInt } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { sendSignupOtpEmail } from "@/lib/email";

const schema = z.object({ email: z.email() });

const generateOtp = () => String(100000 + randomInt(900000));
const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const { email } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 400 },
    );
  }

  const lastToken = await prisma.signupOtpToken.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
  if (
    lastToken &&
    Date.now() - lastToken.createdAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    const retryAfter = Math.ceil(
      (RESEND_COOLDOWN_MS - (Date.now() - lastToken.createdAt.getTime())) /
        1000,
    );
    return NextResponse.json(
      {
        error: "Please wait before requesting another code.",
        retryAfter,
      },
      { status: 429 },
    );
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.signupOtpToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  await prisma.signupOtpToken.create({
    data: { email, token: hashOtp(otp), expiresAt },
  });

  await sendSignupOtpEmail(email, otp);

  return NextResponse.json({ ok: true });
}
