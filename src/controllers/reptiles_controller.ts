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
    name: string,
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

type DeleteReptileBody = {
    id: number
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


        // const {id} = req.body as DeleteReptileBody;
        const id = parseInt(req.params.id)
        console.log(id)
        await client.reptile.delete({
            where:{
                id
            }
        })
        res.json({message: "deleted"});
    }







//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*EVERYTHING BELOW HERE NEEDS TO BE WORKED ON-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*









const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        //Finish implementation

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


const createHusbandry = (client: PrismaClient): RequestHandler =>  //CURRENTLY NOT WORKING**************
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
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


const listHusbandries = (client: PrismaClient): RequestHandler =>  //CURRENTLY NOT WORKING**************
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


const listSchedules = (client: PrismaClient): RequestHandler =>         //CURRENTLY NOT WORKING**************
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


export const reptilesController = controller(
    "reptiles",
    [
        { path: "/", endpointBuilder: createReptile, method: "post"},
        { path: "/", endpointBuilder: listReptiles, method: "get"},
        { path: "/:id", endpointBuilder: deleteReptile, method: "delete"},
    
        { path: "/updateReptile", endpointBuilder: updateReptile, method: "put"},
        { path: "/createFeeding", endpointBuilder: createFeeding, method: "post"},
        { path: "/listFeedings", endpointBuilder: listFeedings, method: "get"},
        { path: "/createHusbandry", endpointBuilder: createHusbandry, method: "post"},
        { path: "/listHusbandry", endpointBuilder: listHusbandries, method: "get"},
        { path: "/createSchedule", endpointBuilder: createSchedule, method: "post"},
        { path: "/listSchedules", endpointBuilder: listSchedules, method: "get"},
    ]
)

                                                                        //STATUS::::
// I should be able to create a user account                           : Good. 
// I should be able to sign into a user account                        : 
// I should be able to create a reptile                                : Good.
// I should be able to delete a reptile                                : Good.
// I should be able to update a reptile                                :
// I should be able to list all of my reptiles                         : Right now we are returning ALL reptiles--> how can we return only the reptiles that belong to the user?
// I should be able to create a feeding for a reptile                  :
// I should be able to list all of the feedings for a reptile          ;
// I should be able to create a husbandry record for a reptile         :
// I should be able to list all of the husbandry records for reptile   :
// I should be able to create a schedule for a reptile                 :
// I should be able to list all of the schedules for a reptile         :
// I should be able to list all of the schedules for a user            :