import { sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a new verification token
    const token = Math.random().toString(36).substr(2, 8);
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiration

    // Store the token in the database (overwrite any existing token)
    await prisma.verificationToken.upsert({
      where: { email_type: { email, type: "email" } },
      update: { token, expires },
      create: { email, token, type: "email", expires },
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
