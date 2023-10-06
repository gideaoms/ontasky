import { Service } from "@/core/services/session/service";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { isError } from "@/utils";
import { FastifyInstance } from "fastify";
import { Factories } from "@/external/module";

const service = new Service(
  Factories.Repositories.User.Repository,
  Factories.Providers.Crypto.Provider,
  Factories.Providers.Token.Provider,
  Factories.Providers.Session.Provider
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
    async preHandler() {
      console.log("pre handler");
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
