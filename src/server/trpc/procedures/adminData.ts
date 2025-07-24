import { z } from "zod";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";

export const getUserInteractions = baseProcedure
  .input(
    z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
      interactionType: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const interactions = await db.userInteraction.findMany({
      where: input.interactionType ? {
        interactionType: input.interactionType
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      take: input.limit,
      skip: input.offset,
    });
    
    const total = await db.userInteraction.count({
      where: input.interactionType ? {
        interactionType: input.interactionType
      } : undefined,
    });
    
    return {
      interactions,
      total,
      hasMore: input.offset + input.limit < total
    };
  });

export const getQueryLogs = baseProcedure
  .input(
    z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
      queryType: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const queries = await db.queryLog.findMany({
      where: input.queryType ? {
        queryType: input.queryType
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      take: input.limit,
      skip: input.offset,
    });
    
    const total = await db.queryLog.count({
      where: input.queryType ? {
        queryType: input.queryType
      } : undefined,
    });
    
    return {
      queries,
      total,
      hasMore: input.offset + input.limit < total
    };
  });

export const getUserPreferences = baseProcedure
  .input(
    z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    })
  )
  .query(async ({ input }) => {
    const preferences = await db.userPreference.findMany({
      orderBy: {
        lastVisit: 'desc'
      },
      take: input.limit,
      skip: input.offset,
    });
    
    const total = await db.userPreference.count();
    
    return {
      preferences,
      total,
      hasMore: input.offset + input.limit < total
    };
  });

export const getAnalytics = baseProcedure
  .query(async () => {
    // Get basic counts
    const totalInteractions = await db.userInteraction.count();
    const totalQueries = await db.queryLog.count();
    const totalUsers = await db.userPreference.count();
    
    // Get interaction types breakdown
    const interactionTypes = await db.userInteraction.groupBy({
      by: ['interactionType'],
      _count: {
        interactionType: true
      },
      orderBy: {
        _count: {
          interactionType: 'desc'
        }
      }
    });
    
    // Get most common property types
    const propertyTypes = await db.userInteraction.groupBy({
      by: ['propertyType'],
      _count: {
        propertyType: true
      },
      where: {
        propertyType: {
          not: null
        }
      },
      orderBy: {
        _count: {
          propertyType: 'desc'
        }
      },
      take: 10
    });
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentInteractions = await db.userInteraction.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    // Get average response times
    const avgResponseTime = await db.userInteraction.aggregate({
      _avg: {
        responseTime: true
      },
      where: {
        responseTime: {
          not: null
        }
      }
    });
    
    return {
      totals: {
        interactions: totalInteractions,
        queries: totalQueries,
        users: totalUsers,
        recentInteractions
      },
      interactionTypes: interactionTypes.map(item => ({
        type: item.interactionType,
        count: item._count.interactionType
      })),
      propertyTypes: propertyTypes.map(item => ({
        type: item.propertyType,
        count: item._count.propertyType
      })),
      performance: {
        averageResponseTime: avgResponseTime._avg.responseTime || 0
      }
    };
  });
