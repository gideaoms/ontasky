import { Service } from "@/core/services/user";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { UserRepository } from "@/external/factories/repositories";
import { CryptoProvider } from "@/external/factories/providers";

const service = new Service(CryptoProvider.Provider, UserRepository.Repository);

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
}
