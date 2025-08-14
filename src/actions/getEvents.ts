"use server";

import prisma from "@/lib/prisma";

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
