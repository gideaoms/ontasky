import { SessionOnTeamProvider } from "@/external/factories/providers";
import {
  TaskRepository,
  UserOnTeamRepository,
} from "@/external/factories/repositories";
import { Service } from "@/internal/services/task";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  UserOnTeamRepository.Repository,
  TaskRepository.Repository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/tasks",
    method: "POST",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        team_id: Type.String({ format: "uuid" }),
        title: Type.String(),
        description: Type.String(),
        approvers: Type.Array(
          Type.Object({ id: Type.String({ format: "uuid" }) })
        ),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id, title, description, approvers } = request.body;
      const result = await service.create(
        authorization,
        team_id,
        title,
        description,
        approvers
      );
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
