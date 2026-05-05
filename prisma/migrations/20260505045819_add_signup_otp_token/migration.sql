-- CreateTable
CREATE TABLE "signup_otp_token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signup_otp_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signup_otp_token_token_key" ON "signup_otp_token"("token");

-- CreateIndex
CREATE INDEX "signup_otp_token_email_idx" ON "signup_otp_token"("email");
