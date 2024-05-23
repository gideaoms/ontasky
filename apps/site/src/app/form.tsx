"use client";

import { sendEmail } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Form() {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  async function submit() {
    setIsSending(true);
    await sendEmail(email);
    setIsSending(false);
    alert("Email sent successfully");
  }

  return (
    <form className="flex w-full max-w-md mx-auto space-x-2" action={submit}>
      <Input
        className="flex-1 bg-white/10 text-white placeholder:text-gray-300 focus:bg-white/20"
        placeholder="Enter your email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        className="bg-white text-[#6366F1] hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#6366F1]"
        type="submit"
      >
        Get Early Access
      </Button>
    </form>
  );
}
