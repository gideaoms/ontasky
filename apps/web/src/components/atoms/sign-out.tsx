"use client";

import { Button } from "@/components/atoms/button";
import { SessionContext } from "@/external/contexts/mod";
import { useState } from "react";

export function SignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const session = SessionContext.useContext();

  function signOut() {
    setIsLoading(true);
    session.signOut();
  }

  return (
    <Button
      variant="ghost"
      className="text-rose-600 w-fit hover:text-rose-400"
      onClick={signOut}
      isLoading={isLoading}
    >
      Logout
    </Button>
  );
}
