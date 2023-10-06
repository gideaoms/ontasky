import { Providers } from "@/core/module";
import bcryptjs from "bcryptjs";

export class Provider implements Providers.Crypto.Provider {
  hash(plain: string) {
    const round = 8;
    return bcryptjs.hash(plain, round);
  }

  compare(plain: string, hashed: string) {
    return bcryptjs.compare(plain, hashed);
  }
}
