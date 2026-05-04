import { createHash } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const schema = z.object({
  email: z.email(),
  otp: z.string().length(6),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { email, otp, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired code. Please start over." },
      { status: 400 },
    );
  }

  // Re-check social guard at reset time
  const credentialAccount = user.accounts.find(
    (a) => a.providerId === "credential",
  );
  if (!credentialAccount) {
    return NextResponse.json(
      {
        error:
          "This email is linked to a social login. Use Google or GitHub to sign in.",
      },
      { status: 400 },
    );
  }

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      token: hashOtp(otp),
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired code. Please start over." },
      { status: 400 },
    );
  }

  const hashed = await hashPassword(password);

  // Atomic: mark token used + update password together
  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    prisma.account.update({
      where: { id: credentialAccount.id },
      data: { password: hashed },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
