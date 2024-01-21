import "reflect-metadata";
import express from "express";
import "express-async-errors"; // needs to be below express
import setupSwagger from "../../../../swagger.json";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes";
import { errorHandler } from "./middlewares/helpers/exceptions/errorHandler";
import cors from "cors";
import "../../container/users";
import "../../container/posts";
import { errors } from "celebrate";

import * as admin from "firebase-admin";
import * as serviceAccount from "../../../../firebase-config.json";

import * as dotenv from "dotenv";
import e from "express";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.docker.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.docker.development" });
} else {
  dotenv.config(); // Load the default .env file for local development
}

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.DATABASE_URL,
});

app.use(cors());

app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(setupSwagger));

app.use(router);

app.use(errors());

app.use(errorHandler);

export { app };
