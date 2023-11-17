import { Loader } from "@/components/organisms/answer/loader";
import { AnswerRepository } from "@/external/repositories";

const answerRepository = new AnswerRepository.Repository();

export default function Page(props: {
  params: { answer_id: string };
  searchParams: { current_team_id: string };
}) {
  return (
    <Loader
      answerId={props.params.answer_id}
      answerRepository={answerRepository}
      currentTeamId={props.searchParams.current_team_id}
    />
  );
}
