import { Feeding, HusbandryRecord, PrismaClient, User } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";
import { usersController } from "./users_controller";

type CreateReptileBody = {
    id: number,
    userId: number,
    species: string,
    name: string,
    sex: string,
}


type UpdateReptileBody = {
    sex: string,
    name: string,
    species: string
}


const createReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const {species, name, sex} = req.body as CreateReptileBody;
        const reptile = await client.reptile.create({
            data: {
                userId,
                species,
                name,
                sex,
            },
        });
        res.json({ reptile });
    }


const listReptiles = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const reptiles = await client.reptile.findMany({
            where: {
                userId
            }
        });
        res.json({ reptiles });
    }



const deleteReptile = (client:PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        //TO DO-->> WE need to check if the reptile belongs to the user --> ANDE WE NEED TO IMPLEMENT THIS ON ALL METHODS

        const id = parseInt(req.params.id)
        await client.reptile.delete({
            where:{
                id
            }
        })
        res.json({message: "deleted"});
    }



const updateReptile = (client:PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        } 

        const id = parseInt(req.params.id)
        const {sex, name, species} = req.body as UpdateReptileBody;
        const updatedReptile = await client.reptile.update({
            where: {
                id,
            },
            data: {
                name,
                sex,
                species
            },
        });

        res.json({ updatedReptile});
    }






export const reptilesController = controller(
    "reptiles",
    [
        { path: "/", endpointBuilder: createReptile, method: "post"},
        { path: "/", endpointBuilder: listReptiles, method: "get"},
        { path: "/:id", endpointBuilder: deleteReptile, method: "delete"},
        { path: "/:id", endpointBuilder: updateReptile, method: "put"},
    ]
)

