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


type getReptileBody = {
    userId: number
}

const listReptiles = (client: PrismaClient): RequestHandler =>  //Should just return all the reptiles of a particular user
    async (req, res) => {
        const {userId} = req.body as getReptileBody;
        const reptiles = await client.reptile.findMany({
            where: {
                userId
            }
        });
        res.json({ reptiles });
}


const deleteReptile = (client: PrismaClient): RequestHandler =>
    async (req, res) => {


}


const updateReptile = (client: PrismaClient): RequestHandler =>
    async (req, res) => {


}


const createFeeding = (client: PrismaClient): RequestHandler =>   //We need to pass in the reptile that we are doing the feeding for
    async (req, res) => {
        const {reptileId, foodItem} = req.body as CreateFeedingBody;
        const reptile = await client.reptile.findFirst({
            // where: {
            //     reptileId
            // }
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
        { path: "/reptile", endpointBuilder: createReptile, method: "post"},
        { path: "/", endpointBuilder: listReptiles, method: "get"},

        //Get reptiles needs to ONLY show the reptiles that belong to that user.

        //We also need to add delete a reptile to postman

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

                                                                                                                                //STATUS::::
// I should be able to create a user account                        POST {{url}}/users                                      : Good. Send a JSON body with firstName, lastName, email, password
// I should be able to sign into a user account                     POST {{url}}/users                                      : 
// I should be able to create a reptile                             POST {{url}}/reptile                                    : Good. BUT, Do we need to be assigning the reptile to a specific user?
// I should be able to delete a reptile                       ~~~~ADD~~~~~                                                  :
// I should be able to update a reptile                             PUT {{url}}/reptile/:id                                 :
// I should be able to list all of my reptiles                      GET {{url}}/reptiles                                    : Right now we are returning ALL reptiles--> how can we return only the reptiles that belong to the user?
// I should be able to create a feeding for a reptile               POST {{url}}/feedings/reptile/:id                       :
// I should be able to list all of the feedings for a reptile       GET {{url}}/feedings/reptile/:id                        ;
// I should be able to create a husbandry record for a reptile      POST {{url}}/husbandry-records/reptile/:id              :
// I should be able to list all of the husbandry records for reptile  GET {{url}}/husbandry-records/reptile/:id             :
// I should be able to create a schedule for a reptile              POST {{url}}/schedule/user/:id_user/reptile/:id_rept    :
// I should be able to list all of the schedules for a reptile      GET {{url}}/schedule/reptile/:id                        :
// I should be able to list all of the schedules for a user         GET {{url}}/schedule/                                   :