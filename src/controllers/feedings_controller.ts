import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";


type CreateFeedingBody = {
    foodItem: string,
}



const createFeeding = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const reptileId = parseInt(req.params.id);
        const {foodItem} = req.body as CreateFeedingBody;

        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId,
            }
        })
        if (reptile && reptile.userId && userId == reptile.userId){
            const feeding = await client.feeding.create({
                data: {
                    reptileId,
                    foodItem
                },
            });
            res.json({ feeding })
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }


const listFeedings = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const reptileId = parseInt(req.params.id);
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        })
        if (reptile && reptile.userId && userId == reptile.userId){
            const feedings = await client.feeding.findMany({
                where: {
                    reptileId
                }
            })
            res.json({ feedings });
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }




export const feedingsController = controller(
    "feedings",
    [
        { path: "/:id", endpointBuilder: createFeeding, method: "post"},
        { path: "/:id", endpointBuilder: listFeedings, method: "get"},
    ]
)