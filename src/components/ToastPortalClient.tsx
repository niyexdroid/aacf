"use client";
import { useToast } from "@/components/ui/Toast";

export function ToastPortalClient() {
  const { ToastContainer } = useToast();
  return <ToastContainer />;
}
