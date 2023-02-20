import express, { RequestHandler } from "express";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv, {config} from "dotenv";
import jwt from "jsonwebtoken";
import { JWTBody, RequestWithJWTBody } from "./dto/jwt";
import { usersController } from "./controllers/users_controller";
import { reptilesController } from "./controllers/reptiles_controller";

config({path: '.env'})
dotenv.config();
const client = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());


//All paths involving user will eventually be here in usersController
usersController(app, client);

reptilesController(app, client);


app.listen(parseInt(process.env.PORT || "3000", 10), () => {
  console.log(`App running on port ${process.env.PORT}`);
});

export default app;
