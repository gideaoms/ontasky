import List from "@/components/organisms/answer/list";
import { AnswerRepository } from "@/external/repositories";

const answerRepository = new AnswerRepository.Repository();

export default async function Page(props: {
  searchParams: { current_team_id: string };
}) {
  return (
    <List
      answerRepository={answerRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
