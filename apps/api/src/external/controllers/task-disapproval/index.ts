import { SessionOnTeamProvider } from "@/external/factories/providers";
import {
  AnswerRepository,
  TaskRepository,
} from "@/external/factories/repositories";
import { Service } from "@/internal/services/task-disapproval";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  TaskRepository.Repository,
  AnswerRepository.Repository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks/:task_id/disapprove",
    method: "PUT",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        task_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        description: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { task_id } = request.params;
      const { team_id, description } = request.body;
      const result = await service.create(
        authorization,
        team_id,
        task_id,
        description
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
