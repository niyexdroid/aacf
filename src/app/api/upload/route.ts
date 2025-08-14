import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const name = formData.get("filename") as string | null;
    const blobName = `uploads/${Date.now()}-${name || file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const { url } = await put(blobName, Buffer.from(arrayBuffer), {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || "application/octet-stream",
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload failed", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
