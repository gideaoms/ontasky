import { SessionOnTeamProvider } from "@/external/factories/providers/index.js";
import { AnswerRepository } from "@/external/factories/repositories/index.js";
import { Service } from "@/core/services/answer/approve/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  AnswerRepository.Repository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/answers/:answer_id/approve",
    method: "PUT",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        answer_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        description: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { answer_id } = request.params;
      const { team_id, description } = request.body;
      const result = await service.exec(
        authorization,
        team_id,
        answer_id,
        description
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
