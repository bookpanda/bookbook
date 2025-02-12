"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function EmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Fetch the session and get the email from it
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setEmail(session.user.email); // Set the email from the session
      } else {
        setError("No email found in session.");
      }
    };

    fetchSession();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const token = formData.get("token");

      if (!email) {
        throw new Error("Email not found.");
      }

      const response = await fetch("/api/auth/verify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Verification failed");
      }

      router.push("/verify/phone");
    } catch (error) {
      setError(`Invalid verification code: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      if (!email) {
        throw new Error("Email not found.");
      }

      const response = await fetch("/api/auth/resend/email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend verification");
      }
    } catch (error) {
      setError(`Failed to resend verification email: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="text-center text-2xl font-bold">Verify your email</h2>
      {email ? (
        <p className="text-center text-gray-600">We have sent a verification code to {email}</p>
      ) : (
        <p className="text-center text-gray-600">No email found in session.</p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="token" type="text" placeholder="Enter verification code" disabled={isLoading} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
      {email && (
        <Button type="button" className="w-full" onClick={resendVerification} disabled={isLoading}>
          Resend verification email
        </Button>
      )}
    </div>
  );
}
