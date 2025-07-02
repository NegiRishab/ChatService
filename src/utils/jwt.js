import jwt from "jsonwebtoken"

export default function  verifyJWT (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};

