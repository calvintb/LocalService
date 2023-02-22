import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";



type CreateFeedingBody = {
    id: number,
    reptileId: number,
    foodItem: string,
}



const createFeeding = (client: PrismaClient): RequestHandler => //CURRENTLY NOT WORKING******************
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const {reptileId, foodItem} = req.body as CreateFeedingBody;
        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        })
        console.log(reptile)

        const feeding = await client.feeding.create({
            data: {
                reptileId,
                foodItem,
            },
        });

        res.json({ feeding });
    }


const listFeedings = (client: PrismaClient): RequestHandler =>  //NEEDS SOME ATTENTION**************
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const reptile = await client.reptile.findFirst({
            where: {
                id: req.jwtBody?.reptileId
            }
        })

        if (reptile === undefined || reptile === null) {
            res.status(401).json({ message: "Reptile doesn't exist" });
            return;
        }

        const feeding = await client.feeding.findMany({
            where: {
                reptileId: reptile.id
            }
        });

        res.json({ feeding });
    }




export const feedingsController = controller(
    "feedings",
    [
        { path: "/:id", endpointBuilder: createFeeding, method: "post"},
        { path: "/:id", endpointBuilder: listFeedings, method: "get"},
    ]
)