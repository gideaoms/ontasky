import { Service } from "@/core/services/session";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { isError } from "@/utils";
import { FastifyInstance } from "fastify";
import { UserRepository } from "@/external/factories/repositories";
import {
  CryptoProvider,
  SessionProvider,
  TokenProvider,
} from "@/external/factories/providers";

const service = new Service(
  UserRepository.Repository,
  CryptoProvider.Provider,
  TokenProvider.Provider,
  SessionProvider.Provider
);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/sessions",
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
    url: "/sessions",
    method: "GET",
    schema: {
      headers: Type.Object({
        authorization: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { authorization } = request.headers;
      const result = await service.show(authorization);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
