import * as jwt from "jsonwebtoken";

export const vertifyJwtToken = (token: string, secretKey: string): any => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
