import { SessionOnTeamProvider } from "@/external/factories/providers/index.js";
import { AnswerQuery } from "@/external/factories/queries/index.js";
import { Service } from "@/core/services/answer/find-one/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(SessionOnTeamProvider.Provider, AnswerQuery.Query);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/answers/:answer_id",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        answer_id: Type.String({ format: "uuid" }),
      }),
      querystring: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { answer_id } = request.params;
      const { team_id } = request.query;
      const result = await service.exec(authorization, team_id, answer_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
