import { Service } from "@/core/services/user-on-team";
import {
  CryptoProvider,
  SessionOnTeamProvider,
} from "@/external/factories/providers";
import {
  TeamRepository,
  UserOnTeamRepository,
  UserRepository,
} from "@/external/factories/repositories";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(
  SessionOnTeamProvider.Provider,
  UserRepository.Repository,
  CryptoProvider.Provider,
  TeamRepository.Repository,
  UserOnTeamRepository.Repository
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams/:team_id/users",
    method: "POST",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      body: Type.Object({
        email: Type.String({ format: "email" }),
      }),
      params: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { email } = request.body;
      const { team_id } = request.params;
      const result = await service.create(authorization, team_id, email);
      if (isError(result)) {
        return replay.code(result.status).send({
          message: result.message,
        });
      }
      return replay.send(result);
    },
  });
}
