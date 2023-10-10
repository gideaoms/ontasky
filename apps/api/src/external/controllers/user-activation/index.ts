import { Service } from "@/core/services/user-activation";
import { UserRepository } from "@/external/factories/repositories";
import { isError } from "@/utils";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

const service = new Service(UserRepository.Repository);

export default async function controller(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    url: "/users/activate",
    method: "PUT",
    schema: {
      body: Type.Object({
        email: Type.String({ format: "email" }),
        validation_code: Type.String(),
      }),
    },
    async handler(request, replay) {
      const { email, validation_code } = request.body;
      const result = await service.update(email, validation_code);
      if (isError(result)) {
        return replay.code(result.status).send({ message: result.message });
      }
      return replay.send(result);
    },
  });
}
