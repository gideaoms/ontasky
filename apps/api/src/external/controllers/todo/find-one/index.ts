import { SessionOnTeamProvider } from "@/external/factories/providers/index.js";
import { TodoQuery } from "@/external/factories/queries/index.js";
import { Service } from "@/core/services/todo/find-one/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(SessionOnTeamProvider.Provider, TodoQuery.Query);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/todos/:todo_id",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        todo_id: Type.String({ format: "uuid" }),
      }),
      querystring: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { todo_id } = request.params;
      const { team_id } = request.query;
      const result = await service.exec(authorization, team_id, todo_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
