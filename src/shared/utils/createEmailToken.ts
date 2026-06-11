import jwt from "jsonwebtoken";

import { envConfig } from "@/config/env.config";

export const createEmailToken = (userId: string) => {
  return jwt.sign({ userId }, envConfig.emailSecret as string, { expiresIn: "15m" }
  );
};
