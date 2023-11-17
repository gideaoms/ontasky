import { Message } from "@/components/atoms/message";
import { Form } from "@/components/organisms/answer/form";
import { AnswerModel } from "@/core/models";
import { AnswerRepository } from "@/core/repositories";
import { isError } from "@/utils";
import { match, P } from "ts-pattern";

export async function Loader(props: {
  answerId?: string;
  answerRepository: AnswerRepository.Repository;
  currentTeamId: string;
}) {
  const answer = await match(props.answerId)
    .with(P.string, (answerId) => {
      return props.answerRepository.findOne(answerId, props.currentTeamId);
    })
    .otherwise(() => AnswerModel.empty());
  if (isError(answer)) {
    return <Message variant="warning">{answer.message}</Message>;
  }
  return <Form answer={answer} currentTeamId={props.currentTeamId} />;
}
