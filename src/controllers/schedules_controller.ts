import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import { controller } from "../lib/controller";


type CreateScheduleBody = {
    id: number,
    reptileId: number,
    userId: number,
    type: string,
    description: string,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
}


const createSchedule = (client: PrismaClient): RequestHandler =>        //CURRENTLY NOT WORKING**************
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const {reptileId, type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body as CreateScheduleBody;
        const schedule = await client.schedule.create({
            data: {
                reptileId,
                userId,
                type,
                description,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday
            },
        });

        res.json({ schedule })
    }


const listSchedulesForUser = (client: PrismaClient): RequestHandler =>         //CURRENTLY NOT WORKING**************
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // const schedules = await client.schedule.findMany({
        //     where: {
        //         reptileId: reptileId
        //     }
        // });

        // res.json({ schedules });
    }

const listSchedulesForReptile = (client: PrismaClient): RequestHandler =>         //CURRENTLY NOT WORKING**************
async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }



}






export const schedulesController = controller(
    "schedules",
    [
        { path: "/:id", endpointBuilder: createSchedule, method: "post"},
        { path: "/:id", endpointBuilder: listSchedulesForReptile, method: "get"},
        { path: "/", endpointBuilder: listSchedulesForUser, method: "get"}
    ]
)
