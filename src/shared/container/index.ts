import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

container.registerSingleton<PrismaClient>("PrismaClient", PrismaClient);
