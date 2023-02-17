import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";


const getMe = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        });

        res.json({ user });

    }


type CreateUserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

const createUser = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {firstName, lastName, email, password} = req.body as CreateUserBody;
        console.log(password, req.body)
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash
            },
        });

        const token = jwt.sign({
            userId: user.id
        }, process.env.ENCRYPTION_KEY!!, {
            expiresIn: '1m'  
        });

        res.json({ user, token })
    }



const getUsers = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const users = await client.user.findMany();
        console.log(users)
        res.json({ users });
    }


export const usersController = controller(
    "users",
    [
        { path: "/me", endpointBuilder: getMe, method: "get"},
        { path: "/", method: "post", endpointBuilder: createUser, skipAuth: true},
        { path: "/listUsers", method: "get", endpointBuilder: getUsers}     //On the path http://localhost:3000/users/listUsers
    ]
)
