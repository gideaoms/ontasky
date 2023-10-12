import { CryptoProvider } from "@/internal/providers";
import bcryptjs from "bcryptjs";

export class Provider implements CryptoProvider.Provider {
  hash(plain: string) {
    const round = 8;
    return bcryptjs.hash(plain, round);
  }

  compare(plain: string, hashed: string) {
    return bcryptjs.compare(plain, hashed);
  }
}
