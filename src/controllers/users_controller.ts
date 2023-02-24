import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";


type LoginBody = {
    email: string,
    password: string
    }

type CreateUserBody = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}



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


const login = (client: PrismaClient): RequestHandler =>  
    async (req, res) => {
        const {email, password} = req.body as LoginBody;
        const user = await client.user.findFirst({
            where: {
            email,
            }
        });
        if (!user) {
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }
        
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }
        
        const token = jwt.sign({
            userId: user.id
        }, process.env.ENCRYPTION_KEY!!, {
            expiresIn: '30m'
        });
        res.json({
            user,
            token
        })
    };


const createUser = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {firstName, lastName, email, password} = req.body as CreateUserBody;
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
            expiresIn: '30m'  
        });

        res.json({ user, token })
    }



export const usersController = controller(
    "users",
    [
        { path: "/me", endpointBuilder: getMe, method: "get"},
        { path: "/", method: "post", endpointBuilder: createUser, skipAuth: true},
        { path: "/login", method: "post", endpointBuilder: login}
    ]
)
