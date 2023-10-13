import { Message } from "@/components/atoms/message";
import { Form } from "@/components/organisms/team/form";
import { TeamModel } from "@/core/models";
import { TeamRepository } from "@/core/repositories/mod";
import { isError } from "@/utils";
import { match, P } from "ts-pattern";

export async function Loader(props: {
  teamId?: string;
  teamRepository: TeamRepository.Repository;
  currentTeamId: string;
}) {
  const team = await match(props.teamId)
    .with(P.string, function (taskId) {
      return props.teamRepository.findById(taskId);
    })
    .otherwise(function () {
      return TeamModel.empty();
    });
  if (isError(team)) {
    return <Message variant="warning">{team.message}</Message>;
  }
  return <Form team={team} currentTeamId={props.currentTeamId} />;
}
