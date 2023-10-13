import { SessionOnTeamProvider } from "@/external/factories/providers";
import { TodoRepository } from "@/external/factories/repositories";
import { Service } from "@/core/services/todo/disapprove";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  TodoRepository.Repository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/todos/:todo_id/disapprove",
    method: "PUT",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        todo_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        description: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { todo_id } = request.params;
      const { team_id, description } = request.body;
      const result = await service.create(
        authorization,
        team_id,
        todo_id,
        description
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
