import { UseCase } from "@/core/services/user/join-team/index.js";
import {
  CryptoProvider,
  SessionProvider,
} from "@/external/factories/providers/index.js";
import { UserRepository } from "@/external/factories/repositories/index.js";
import { isError } from "@/utils.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const userCase = new UseCase(
  SessionProvider.Provider,
  UserRepository.Repository,
  CryptoProvider.Provider
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/teams/:team_id/users",
    method: "POST",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
      params: Type.Object({
        team_id: Type.String({ format: "uuid" }),
      }),
      body: Type.Object({
        email: Type.String({ format: "email" }),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const { team_id } = request.params;
      const { email } = request.body;
      const result = await userCase.exec(authorization, team_id, email);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
