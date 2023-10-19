"use client";

import { Loading } from "@/components/atoms/loading";
import { Sidebar } from "@/components/molecules/sidebar";
import { List } from "@/components/organisms/home/list";
import { TeamModel, UserModel } from "@/core/models";
import { SessionContext, TeamContext, UserContext } from "@/external/contexts";
import { isError } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout(props: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { teamRepository } = TeamContext.useContext();
  const { userRepository } = UserContext.useContext();
  const { setTeam, user } = SessionContext.useContext();
  const router = useRouter();
  const params = useSearchParams();
  const currentTeamId = params.get("current_team_id");

  async function onInit(currentTeamId: string) {
    setIsLoading(true);
    const currentUser = UserModel.build({
      id: user?.id,
      team: TeamModel.build({
        id: currentTeamId,
      }),
    });
    const team = await userRepository.findTeam(currentUser);
    if (isError(team)) {
      router.push("/");
      return;
    }
    setTeam(team);
    setIsLoading(false);
  }

  useEffect(
    function () {
      if (currentTeamId) {
        onInit(currentTeamId);
      } else {
        setIsLoading(false);
      }
    },
    [currentTeamId]
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!currentTeamId) {
    return <List teamRepository={teamRepository} />;
  }

  return (
    <div className="antialiased flex">
      <Sidebar currentTeamId={currentTeamId} />
      <main className="flex-1 p-4">{props.children}</main>
    </div>
  );
}
