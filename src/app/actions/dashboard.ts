"use server";

import { db as prisma } from "@/lib/db";
import {
  BillingAccessError,
  getUserBillingState,
} from "@/lib/credits/usage";
import {
  AuthSessionError,
  ensureDatabaseUser,
} from "@/lib/auth/ensure-user";

export interface DashboardOverview {
  currentTier: "FREE" | "PRO" | "STUDIO";
  currentPeriodEnd: string | null;
  usageStats: {
    creditsUsed: number;
    creditsTotal: number;
    generationMode: "CREDITS" | "UNLIMITED";
    remainingCredits: number;
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
    const appUser = await ensureDatabaseUser();
    const user = await prisma.user.findUnique({
      where: { id: appUser.id },
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

    const billingState = await getUserBillingState(user.id);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [generationsThisMonth, recentDesigns] = await Promise.all([
      prisma.tattooGeneration.count({
        where: {
          userId: user.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.tattooGeneration.findMany({
        where: { userId: user.id },
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
    ]);

    return {
      success: true,
      data: {
        currentTier: billingState.tier,
        currentPeriodEnd: user.subscription?.currentPeriodEnd.toISOString() || null,
        usageStats: {
          creditsUsed: billingState.usageConsumed,
          creditsTotal: billingState.usageCap,
          generationMode: billingState.generationMode,
          remainingCredits: billingState.creditBalance,
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
    if (error instanceof AuthSessionError || error instanceof BillingAccessError) {
      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch dashboard" },
    };
  }
}