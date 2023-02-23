import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { isNumberObject } from "util/types";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";


type CreateHusbandryBody = {
    id: number,
    reptileId: number,
    length: number,
    weight: number,
    temperature: number,
    humidity: number,
}


const createHusbandry = (client: PrismaClient): RequestHandler =>  
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        console.log("husbandry activated");

        const length =  parseInt(req.body.length);
        const weight = parseInt(req.body.weight);
        const temperature = parseInt(req.body.temperature);
        const humidity = parseInt(req.body.humidity);

        // const {length, weight, temperature, humidity} = req.body as CreateHusbandryBody;

        const reptileId = parseInt(req.params.id);

        const reptile = await client.reptile.findFirst({
            where: {
                id: reptileId
            }
        });

        if (reptile && reptile.userId && userId == reptile.userId){

            const husbandry = await client.husbandryRecord.create({
                data: {
                    reptileId,
                    length,
                    weight,
                    temperature,
                    humidity
                },
            });

            res.json({ husbandry });
        } else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
    }


const listHusbandries = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // const husbandry = await client.husbandryRecord.findMany({
        //     where: {
        //         reptileId: reptileId
        //     }
        // });

        // res.json({ husbandry });
    }



export const husbandryController = controller(
    "husbandry-records",
    [
        { path: "/:id", endpointBuilder: createHusbandry, method: "post"},
        { path: "/:id", endpointBuilder: listHusbandries, method: "get"}
    ]
)