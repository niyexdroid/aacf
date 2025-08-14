"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Trash2, Image, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  eventId: string;
  createdAt: string;
}

export default function ManageGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const sessionRes = await fetch("/api/auth/session", {
        credentials: "include",
      });
      if (sessionRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const res = await fetch("/api/gallery-list", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load images");
      const data = await res.json();
      setImages(data);
    } catch (e: any) {
      console.error(e);
      addToast(e.message || "Failed to load images", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setImages((prev) => prev.filter((i) => i.id !== id));
      addToast("Image deleted", "success");
    } catch (e: any) {
      console.error(e);
      addToast(e.message || "Error deleting", "error");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Gallery</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/admin/upload-gallery")}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Upload Images
          </Button>
          <Button
            variant="outline"
            onClick={fetchImages}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      {images.length === 0 ? (
        <div className="rounded bg-white p-12 text-center shadow">
          <Image className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-4 text-gray-600">No images yet.</p>
          <Button
            onClick={() => router.push("/admin/upload-gallery")}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Upload Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow"
            >
              <img
                src={img.url}
                alt={img.caption || "Gallery image"}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="line-clamp-2 p-3 text-sm text-gray-700">
                {img.caption}
              </div>
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deletingId === img.id}
                className="absolute right-2 top-2 rounded bg-white/80 p-1 text-red-600 shadow hover:bg-white disabled:opacity-50"
                aria-label="Delete image"
                title="Delete image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
