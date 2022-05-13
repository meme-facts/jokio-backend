import "reflect-metadata";
import express from "express";
import setupSwagger from "../../../../swagger.json";
import swaggerUi from "swagger-ui-express";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import "../../container";
import createConnection from "../../infra/typeorm";
export const app = express();
app.use(cors());
app.use(express.json());

createConnection();
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(setupSwagger));

app.use(router);

app.use(errorHandler);
