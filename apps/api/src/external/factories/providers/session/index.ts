import { UserRepository } from "@/external/factories/repositories";
import { SessionProvider } from "@/external/providers";
import * as TokenProvider from "@/external/factories/providers/token";

export const Provider = new SessionProvider.Provider(
  TokenProvider.Provider,
  UserRepository.Repository
);
