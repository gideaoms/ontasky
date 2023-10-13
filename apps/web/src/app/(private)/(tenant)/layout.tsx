"use client";

import { Loading } from "@/components/atoms/loading";
import { Sidebar } from "@/components/molecules/sidebar";
import { List } from "@/components/organisms/home/list";
import { SessionContext, TeamContext } from "@/external/contexts";
import { isError } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout(props: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { teamRepository } = TeamContext.useContext();
  const { setTeam } = SessionContext.useContext();
  const router = useRouter();
  const params = useSearchParams();
  const currentTeamId = params.get("current_team_id");

  async function onInit(currentTeamId: string) {
    setIsLoading(true);
    const result = await teamRepository.findById(currentTeamId);
    if (isError(result)) {
      router.push("/");
      return;
    }
    // const { user_on_team, ...team } = result;
    setTeam(result);
    // setUserOnTeam(user_on_team);
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
