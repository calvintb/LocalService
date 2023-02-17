import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";


//TO-DO: Fill out with Reptile stuff







export const usersController = controller(
    "reptiles",
    [
        // { path: "/me", endpointBuilder: getMe, method: "get"},
    ]
)