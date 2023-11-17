"use client";

import { sendEmail } from "@/app/actions";
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
    <form className="flex gap-2 justify-center" action={submit}>
      <input
        placeholder="example@mail.com"
        className="border p-2 rounded"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        disabled={isSending}
        type="submit"
        className="bg-violet-700 text-white p-2 rounded"
      >
        Free trial
      </button>
    </form>
  );
}
