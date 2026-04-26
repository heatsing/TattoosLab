"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import {
  getCreditBalance,
  getTierCreditAllowance,
} from "@/lib/credits/usage";

export interface DashboardOverview {
  currentTier: "FREE" | "PRO" | "STUDIO";
  currentPeriodEnd: string | null;
  usageStats: {
    creditsUsed: number;
    creditsTotal: number;
    generationsThisMonth: number;
    designsSaved: number;
    favoritesCount: number;
  };
  recentDesigns: {
    id: string;
    prompt: string;
    style: string;
    createdAt: string;
    status: string;
  }[];
}

export async function getDashboardOverview(): Promise<{
  success: boolean;
  data?: DashboardOverview;
  error?: { code: string; message: string };
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        _count: {
          select: {
            generations: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      };
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [generationsThisMonth, recentDesigns, creditsRemaining] =
      await Promise.all([
        prisma.tattooGeneration.count({
          where: {
            userId,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.tattooGeneration.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            prompt: true,
            status: true,
            createdAt: true,
            style: {
              select: {
                name: true,
              },
            },
          },
        }),
        getCreditBalance(userId),
      ]);

    const currentTier = user.subscription?.tier || "FREE";
    const creditsTotal = getTierCreditAllowance(currentTier);
    const creditsUsed = Math.max(0, creditsTotal - creditsRemaining);

    return {
      success: true,
      data: {
        currentTier,
        currentPeriodEnd: user.subscription?.currentPeriodEnd.toISOString() || null,
        usageStats: {
          creditsUsed,
          creditsTotal,
          generationsThisMonth,
          designsSaved: user._count.generations,
          favoritesCount: user._count.favorites,
        },
        recentDesigns: recentDesigns.map((design) => ({
          id: design.id,
          prompt: design.prompt,
          style: design.style.name,
          createdAt: design.createdAt.toISOString(),
          status: design.status.toLowerCase(),
        })),
      },
    };
  } catch (error) {
    console.error("Get dashboard overview error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch dashboard" },
    };
  }
}
