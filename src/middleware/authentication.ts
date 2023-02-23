import { RequestHandler } from "express";
import { RequestWithJWTBody, JWTBody } from "../dto/jwt";
import jwt from "jsonwebtoken";

export const authenticationMiddleware: RequestHandler = async (req: RequestWithJWTBody, res, next) => {
    //Parsing token and find user
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const jwtBody = jwt.verify(token || '', process.env.ENCRYPTION_KEY!!) as JWTBody;
        req.jwtBody = jwtBody;
        console.log("token is valid");
    } catch (error) {
        console.log("token failed validation");
    } finally {
        next();
    }
}