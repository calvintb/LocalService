import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";

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
        const id = parseInt(req.params.id)
        const reptile = await client.reptile.findFirst({
            where: {
                id
            }
        })
        if (reptile && reptile.userId && userId == reptile.userId){
            await client.reptile.delete({
                where: {
                    id
                },
            })
            res.json({message: "deleted"});
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }






const updateReptile = (client:PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        } 
        const reptileId = parseInt(req.params.id)
        const {sex, name, species} = req.body as UpdateReptileBody;

        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId,
            }
        })

        if (reptile && reptile.userId && userId == reptile.userId){
            const updatedReptile = await client.reptile.update({
                where: {
                    id: reptileId
                },
                data: {
                    name,
                    sex,
                    species
                },
            });
            res.json({ updatedReptile })
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
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