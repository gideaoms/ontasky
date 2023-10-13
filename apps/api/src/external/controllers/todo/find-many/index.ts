import { SessionOnTeamProvider } from "@/external/factories/providers";
import { TodoQuery } from "@/external/factories/queries";
import { Service } from "@/core/services/todo/find-many";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(SessionOnTeamProvider.Provider, TodoQuery.Query);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/todos",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      querystring: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.query;
      const result = await service.exec(authorization, team_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}