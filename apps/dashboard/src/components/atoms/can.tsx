"use client";

import { RoleModel } from "@/core/models";
import { SessionContext } from "@/external/contexts";
import { ReactNode } from "react";

export function Can(props: { children: ReactNode; role: RoleModel.Model }) {
  const { team } = SessionContext.useContext();
  if (team?.role !== props.role) {
    return null;
  }
  return props.children;
}
