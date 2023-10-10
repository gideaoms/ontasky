import { Service } from "@/core/services/user";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { UserRepository } from "@/external/factories/repositories";
import {
  CryptoProvider,
  SessionOnTeamProvider,
} from "@/external/factories/providers";
import { UserQuery } from "@/external/factories/queries";

const service = new Service(
  CryptoProvider.Provider,
  UserRepository.Repository,
  SessionOnTeamProvider.Provider,
  UserQuery.Query
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/users",
    method: "POST",
    schema: {
      body: Type.Object({
        email: Type.String({ format: "email" }),
        password: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { email, password } = request.body;
      const result = await service.create(email, password);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });

  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/users",
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
      const result = await service.index(authorization, team_id);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
