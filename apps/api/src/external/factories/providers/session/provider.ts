import { Repositories } from "@/external/factories/module";
import { SessionProvider } from "@/external/providers/module";
import * as TokenProvider from "@/external/factories/providers/token/provider";

export const Provider = new SessionProvider.Provider(
  TokenProvider.Provider,
  Repositories.User.Repository
);
