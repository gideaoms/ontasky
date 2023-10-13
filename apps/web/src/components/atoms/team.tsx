"use client";

import { SessionContext } from "@/external/contexts";

export function Team() {
  const { team } = SessionContext.useContext();
  return <span className="text-sm text-gray-900">{team?.name}</span>;
}
