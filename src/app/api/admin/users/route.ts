import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/admin";
import { AuthSessionError } from "@/lib/auth/ensure-user";
import {
  Auth0ManagementError,
  isAuth0ManagementConfigured,
} from "@/lib/auth0-management";
import { syncAuth0UsersToDatabase } from "@/lib/auth0-sync";
import { db as prisma } from "@/lib/db";

const optionalSearchSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().max(120).optional());

const listUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  search: optionalSearchSchema,
});

const syncUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: optionalSearchSchema,
});

function buildUserWhere(search?: string): Prisma.UserWhereInput {
  if (!search) {
    return {};
  }

  return {
    OR: [
      { id: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ],
  };
}

function getQueryPayload(request: NextRequest) {
  return listUsersSchema.parse({
    page: request.nextUrl.searchParams.get("page") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
    search: request.nextUrl.searchParams.get("search") ?? undefined,
  });
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminUser();
    const payload = getQueryPayload(request);
    const where = buildUserWhere(payload.search);
    const skip = (payload.page - 1) * payload.limit;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: payload.limit,
        select: {
          id: true,
          email: true,
          name: true,
          imageUrl: true,
          authProvider: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          subscription: {
            select: {
              tier: true,
              status: true,
              currentPeriodEnd: true,
              paymentProvider: true,
            },
          },
          creditLedger: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              balance: true,
            },
          },
          _count: {
            select: {
              generations: true,
              tryOnProjects: true,
              payments: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
          authProvider: user.authProvider,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
          creditBalance: user.creditLedger[0]?.balance ?? 0,
          subscription: user.subscription,
          counts: user._count,
        })),
        pagination: {
          page: payload.page,
          limit: payload.limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / payload.limit)),
        },
        managementApiConfigured: isAuth0ManagementConfigured,
      },
    });
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters.",
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("Admin users list error:", error);

    return NextResponse.json(
      {
        error: "Failed to list users.",
        code: "ADMIN_USERS_LIST_FAILED",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();

    const body = await request.json().catch(() => ({}));
    const payload = syncUsersSchema.parse(body);
    const result = await syncAuth0UsersToDatabase({
      page: payload.page - 1,
      perPage: payload.limit,
      search: payload.search,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        managementApiConfigured: isAuth0ManagementConfigured,
      },
    });
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }

    if (error instanceof Auth0ManagementError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.status }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid sync request.",
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("Admin users sync error:", error);

    return NextResponse.json(
      {
        error: "Failed to sync Auth0 users.",
        code: "ADMIN_USERS_SYNC_FAILED",
      },
      { status: 500 }
    );
  }
}
