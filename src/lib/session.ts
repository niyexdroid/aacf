import "server-only";
import { decrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const store = await cookies();
  const session = store.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/admin/login");
  }
  return session.userId;
}
