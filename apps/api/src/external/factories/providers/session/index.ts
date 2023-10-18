import { UserRepository } from "@/external/factories/repositories/index.js";
import { SessionProvider } from "@/external/providers/index.js";
import * as TokenProvider from "@/external/factories/providers/token/index.js";

export const Provider = new SessionProvider.Provider(
  TokenProvider.Provider,
  UserRepository.Repository
);
