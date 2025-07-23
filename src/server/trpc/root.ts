import {
  createCallerFactory,
  createTRPCRouter,
  baseProcedure,
} from "~/server/trpc/main";
import { generateRealEstateAdvice } from "~/server/trpc/procedures/generateRealEstateAdvice";

export const appRouter = createTRPCRouter({
  generateRealEstateAdvice,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
