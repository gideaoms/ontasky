import { Service } from "@/core/services/team";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { TeamQuery } from "@/external/queries";
import { isError } from "@/utils";
import { SessionProvider } from "@/external/factories/providers";
import { TeamRepository } from "@/external/repositories";

const teamQuery = new TeamQuery.Query();
const teamRepository = new TeamRepository.Repository();
const service = new Service(
  SessionProvider.Provider,
  teamQuery,
  teamRepository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const result = await service.index(authorization);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams",
    method: "POST",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        name: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { name } = request.body;
      const result = await service.create(authorization, name);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams/:team_id",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.params;
      const result = await service.show(authorization, team_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams/:team_id",
    method: "PUT",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        name: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.params;
      const { name } = request.body;
      const result = await service.update(authorization, team_id, name);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
