import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";

const schema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { email, otp } = parsed.data;

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
      { error: "Invalid or expired code." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
