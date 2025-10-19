import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cache, { invalidateCache } from "@/lib/cache";
import {
  parsePaginationParams,
  createPaginationResult,
} from "@/lib/pagination";
import { logApiRequest, logDbOperation } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let status = 200;

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const category = searchParams.get("category");

    // Generate cache key
    const cacheKey = `blogs:${page}:${limit}:${category || "all"}`;

    // Try to get from cache
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // Parse pagination params
    const {
      page: pageNum,
      limit: limitNum,
      skip,
    } = parsePaginationParams(page, limit);

    // Build where clause
    const where = category ? { category } : {};

    // Fetch data with pagination
    const dbStartTime = Date.now();
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.blog.count({ where }),
    ]);
    const dbDuration = Date.now() - dbStartTime;
    logDbOperation("SELECT", "Blog", dbDuration);

    const result = createPaginationResult(blogs, total, pageNum, limitNum);

    // Cache for 5 minutes
    cache.set(cacheKey, result, 300);

    return NextResponse.json(result);
  } catch (e) {
    status = 500;
    console.error("GET /api/blogs error", e);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  } finally {
    const duration = Date.now() - startTime;
    logApiRequest("GET", "/api/blogs", duration, status);
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let status = 201;

  try {
    const session = await getSession();
    if (!session) {
      status = 401;
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { title, excerpt, content, category, image } = body;
    if (!title || !excerpt || !content || !category) {
      status = 400;
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const dbStartTime = Date.now();
    const blog = await prisma.blog.create({
      data: { title, excerpt, content, category, image: image || null },
    });
    const dbDuration = Date.now() - dbStartTime;
    logDbOperation("INSERT", "Blog", dbDuration);

    // Invalidate blog cache
    invalidateCache("blogs:*");

    return NextResponse.json(blog, { status: 201 });
  } catch (e) {
    status = 500;
    console.error("POST /api/blogs error", e);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  } finally {
    const duration = Date.now() - startTime;
    logApiRequest("POST", "/api/blogs", duration, status);
  }
}
