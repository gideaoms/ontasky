"use client";

import { RoleModel } from "@/core/models";
import { SessionContext } from "@/external/contexts";
import { ReactNode } from "react";

export function Can(props: { children: ReactNode; role: RoleModel.Model }) {
  const { team } = SessionContext.useContext();
  console.log(team?.role, props.role);
  if (team?.role !== props.role) {
    return null;
  }
  return props.children;
}
