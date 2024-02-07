import { errors } from "celebrate";
import cors from "cors";
import express from "express";
import "express-async-errors"; // needs to be below express
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import setupSwagger from "../../../../swagger.json";
import "../../container/posts";
import "../../container/users";
import { errorHandler } from "./middlewares/helpers/exceptions/errorHandler";
import { router } from "./routes";

import * as admin from "firebase-admin";
import * as serviceAccount from "../../../../firebase-config.json";

import * as dotenv from "dotenv";
import { initializeSocket } from "../socket/server";
import http from "http";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.docker.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.docker.development" });
} else {
  dotenv.config(); // Load the default .env file for local development
}

const server = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.DATABASE_URL,
});

server.use(cors());

server.use(express.json());

server.use("/swagger", swaggerUi.serve, swaggerUi.setup(setupSwagger));

server.use(router);

server.use(errors());

server.use(errorHandler);

const app = http.createServer(server);

initializeSocket(app);

export { app };
