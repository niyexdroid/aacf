import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Lazily resolve the secret so middleware doesn't crash at import time.
// In development we generate a temporary in-memory secret if none is provided
// so the app can still boot. In production we require SESSION_SECRET.
function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (secret) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore - attach to globalThis to keep stable across hot reloads
    if (!globalThis.__DEV_SESSION_SECRET) {
      // Not cryptographically ideal across restarts, but fine for local dev.
      // Encourage user to set SESSION_SECRET for stability between restarts.
      // random 64 hex chars
      const rand = (globalThis.crypto || require("crypto"))
        .randomUUID()
        .replace(/-/g, "")
        .padEnd(64, "0")
        .slice(0, 64);
      // @ts-ignore
      globalThis.__DEV_SESSION_SECRET = rand;
      // eslint-disable-next-line no-console
      console.warn(
        "[auth] SESSION_SECRET not set – using ephemeral dev secret. Add SESSION_SECRET to your .env file.",
      );
    }
    // @ts-ignore
    return new TextEncoder().encode(globalThis.__DEV_SESSION_SECRET as string);
  }
  throw new Error("SESSION_SECRET not set");
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as any;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const store = await cookies();
  store.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value; // request cookies still sync
  if (!session) return;
  const payload = await decrypt(session);
  if (!payload) return;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const store = await cookies();
  store.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete("session");
}

export async function verifySessionToken(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) return null;

    const payload = await decrypt(session);
    if (!payload?.userId) return null;

    // Return session with isAdmin flag (you can customize this logic)
    return {
      userId: payload.userId,
      isAdmin: true, // For now, assume all authenticated users are admins
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}
