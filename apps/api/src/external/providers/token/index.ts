import { TokenProvider } from "@/core/providers/index.js";
import { APP_TOKEN_SECRET } from "@/envs.js";
import jsonwebtoken from "jsonwebtoken";

export class Provider implements TokenProvider.Provider {
  generate(sub: string) {
    return jsonwebtoken.sign({ sub }, APP_TOKEN_SECRET, {
      expiresIn: "90 days",
    });
  }

  verify(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, APP_TOKEN_SECRET);
      return String(decoded.sub);
    } catch {
      return null;
    }
  }
}
