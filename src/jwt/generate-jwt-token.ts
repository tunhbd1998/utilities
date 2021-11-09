import * as jwt from "jsonwebtoken";

export const generateJwtToken = (payload: any, secretKey: string): string => {
  if (!payload) {
    return null;
  }

  return jwt.sign(payload, secretKey);
};
