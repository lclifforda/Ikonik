import {
  createCallerFactory,
  createTRPCRouter,
  baseProcedure,
} from "~/server/trpc/main";
import { generateRealEstateAdvice } from "~/server/trpc/procedures/generateRealEstateAdvice";
import { adminLogin, verifyAdminToken } from "~/server/trpc/procedures/adminAuth";
import { getUserInteractions, getQueryLogs, getUserPreferences, getAnalytics } from "~/server/trpc/procedures/adminData";

export const appRouter = createTRPCRouter({
  generateRealEstateAdvice,
  // Admin authentication
  adminLogin,
  verifyAdminToken,
  // Admin data
  getUserInteractions,
  getQueryLogs,
  getUserPreferences,
  getAnalytics,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
