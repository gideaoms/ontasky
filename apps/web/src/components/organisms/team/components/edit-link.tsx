"use client";

import { TeamModel } from "@/core/models";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";

export function EditLink(props: {
  team: TeamModel.Model;
  currentTeamId: string;
}) {
  // const { userOnTeam } = SessionContext.useContext();
  // if (!UserOnTeamModel.isAdmin(userOnTeam!)) {
  //   return null;
  // }
  // TODO: add role here
  return (
    <Link
      href={`teams/${props.team.id}?current_team_id=${props.currentTeamId}`}
      className="inline-block"
    >
      <ClipboardEdit className="h-5 w-5" />
    </Link>
  );
}
