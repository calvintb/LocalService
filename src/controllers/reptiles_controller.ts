import { Feeding, HusbandryRecord, PrismaClient, User } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { controller } from "../lib/controller";
import { usersController } from "./users_controller";










//TO-DO everything in bodies is type string rn but some need to be int, float in the database
type CreateReptileBody = {
    id: number,
    userId: number,
    species: string,
    name: string, //either 'm' or 'f'
    sex: string,
}

type CreateFeedingBody = {
    id: number,
    reptileId: number,
    foodItem: string,
}

type CreateHusbandryBody = {
    id: number,
    reptileId: number,
    length: number,
    weight: number,
    temperature: number,
    humidity: number,
}

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

const createReptile = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {userId, species, name, sex} = req.body as CreateReptileBody;
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


const listReptiles = (client: PrismaClient): RequestHandler =>  //Should just return all the reptiles of a particular user
    async (req, res) => {
        const reptiles = await client.reptile.findMany();
        console.log(reptiles)
        res.json({ reptiles });
}


const deleteReptile = (client: PrismaClient): RequestHandler =>
    async (req, res) => {


}


const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req, res) => {


}


const createFeeding = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {reptileId, foodItem} = req.body as CreateFeedingBody;
        const feeding = await client.feeding.create({
            data: {
                reptileId,
                foodItem
            },
        });

        res.json({ feeding });
}


const listFeedings = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
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


const createHusbandry = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {reptileId, length, weight, temperature, humidity} = req.body as CreateHusbandryBody;
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
}


const listHusbandries = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const reptileId = req.jwtBody?.reptileId; //req.jwtBody?.userId;
        if (!reptileId) {
            res.status(401).json({ message: "Reptile doesn't exist" });
            return;
        }

        const husbandry = await client.husbandryRecord.findMany({
            where: {
                reptileId: reptileId
            }
        });

        res.json({ husbandry });
}


const createSchedule = (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const {reptileId, userId, type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body as CreateScheduleBody;
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


const listSchedules = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const reptileId = req.jwtBody?.reptileId; //req.jwtBody?.userId;
        if (!reptileId) {
            res.status(401).json({ message: "Reptile doesn't exist" });
            return;
        }

        const schedules = await client.schedule.findMany({
            where: {
                reptileId: reptileId
            }
        });

        res.json({ schedules });
}


export const reptilesController = controller(
    "reptiles",
    [
        { path: "/createReptile", endpointBuilder: createReptile, method: "post"},
        { path: "/listReptiles", endpointBuilder: listReptiles, method: "get"},
        { path: "/deleteReptile", endpointBuilder: deleteReptile, method: "delete"},
        { path: "/updateReptile", endpointBuilder: updateReptile, method: "put"},
        { path: "/createFeeding", endpointBuilder: createFeeding, method: "post"},
        { path: "/listFeedings", endpointBuilder: listFeedings, method: "get"},
        { path: "/createHusbandry", endpointBuilder: createHusbandry, method: "post"},
        { path: "/listHusbandry", endpointBuilder: listHusbandries, method: "get"},
        { path: "/createSchedule", endpointBuilder: createSchedule, method: "post"},
        { path: "/listSchedules", endpointBuilder: listSchedules, method: "get"},
    ]
)






























// //TO-DO: Fill out with Reptile stuff

// // const getMe = (client: PrismaClient): RequestHandler =>
// //     async (req: RequestWithJWTBody, res) => {
// //         const userId = req.jwtBody?.userId;
// //         if (!userId) {
// //             res.status(401).json({ message: "Unauthorized" });
// //             return;
// //         }

// //         const user = await client.user.findFirst({
// //             where: {
// //                 id: userId
// //             }
// //         });

// //         res.json({ user });

// //     }




// type CreateReptileBody = {
//     species: string,
//     name: string,
//     sex: string,
//     userId: number
//     // user: User
// }




// const createReptile = (client: PrismaClient): RequestHandler =>
//     async (req, res) => {
//         const {species, name, sex, userId} = req.body as CreateReptileBody;
//         console.log(req.body)
//         const reptile = await client.reptile.create({
//             data: {
//                 species,
//                 name,
//                 sex,
//                 userId,
//                 //I think I also need 'user' object here
//             },
//         });

//         const token = jwt.sign({
//             reptileId: reptile.id
//         }, process.env.ENCRYPTION_KEY!!, {
//             expiresIn: '1m'  
//         });

//         res.json({ reptile, token })  //, token 
//     }





// export const reptilesController = controller(
//     "reptiles",
//     [
//         { path: "/createReptile", method: "post", endpointBuilder: createReptile, skipAuth: true},
//     ]
// )