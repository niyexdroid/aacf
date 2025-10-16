import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cache from '@/lib/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get cache statistics
    const cacheStats = cache.getStats();

    // Get database counts
    const [totalBlogs, totalEvents, totalGallery, totalDonors] = await Promise.all([
      prisma.blog.count(),
      prisma.event.count(),
      prisma.galleryImage.count(),
      prisma.donor.count(),
    ]);

    // Calculate session expiry
    let expiresIn = 'N/A';
    let isValid = false;
    if (session.expiresAt) {
      const remainingMs = session.expiresAt - Date.now();
      if (remainingMs > 0) {
        isValid = true;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        expiresIn = `${hours}h ${minutes}m`;
      } else {
        expiresIn = 'Expired';
      }
    }

    return NextResponse.json({
      cache: {
        size: cacheStats.size,
        keys: cacheStats.keys,
        hitRate: 0, // You can implement hit rate tracking if needed
      },
      database: {
        totalBlogs,
        totalEvents,
        totalGallery,
        totalDonors,
      },
      session: {
        expiresIn,
        isValid,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}
