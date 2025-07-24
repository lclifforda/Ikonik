import { z } from "zod";
import jwt from "jsonwebtoken";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";

export const adminLogin = baseProcedure
  .input(
    z.object({
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    // Direct comparison since ADMIN_PASSWORD is plain text
    if (input.password !== env.ADMIN_PASSWORD) {
      throw new Error("Invalid admin password");
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        role: "admin",
        loginTime: Date.now()
      }, 
      env.JWT_SECRET, 
      { expiresIn: "24h" }
    );
    
    return {
      success: true,
      token,
      expiresIn: "24h"
    };
  });

export const verifyAdminToken = baseProcedure
  .input(
    z.object({
      token: z.string(),
    })
  )
  .query(async ({ input }) => {
    try {
      const verified = jwt.verify(input.token, env.JWT_SECRET);
      const parsed = z.object({ 
        role: z.string(),
        loginTime: z.number()
      }).parse(verified);
      
      if (parsed.role !== "admin") {
        throw new Error("Invalid token role");
      }
      
      return {
        valid: true,
        data: parsed
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid token"
      };
    }
  });
