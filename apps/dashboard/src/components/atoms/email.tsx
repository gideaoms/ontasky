"use client";

import { SessionContext } from "@/external/contexts";

export function Email() {
  const { user } = SessionContext.useContext();
  return <span className="text-xs text-gray-600">{user?.email}</span>;
}
