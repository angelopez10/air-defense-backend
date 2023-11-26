import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) return res.status(401).json({ message: "Unauthorized" });

    req.user = decoded;
  });

  next();
};
