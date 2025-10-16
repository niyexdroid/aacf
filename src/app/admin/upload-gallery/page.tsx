"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Image,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
// import { getEvents } from "@/actions/getEvents"; // avoid calling server action directly from client
import { useToast } from "@/components/ui/Toast";

interface GalleryImage {
  title: string;
  caption: string;
  date: string;
  eventId?: string;
}

export default function UploadGalleryPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageData, setImageData] = useState<GalleryImage>({
    title: "",
    caption: "",
    date: new Date().toISOString().split("T")[0],
    eventId: "",
  });
  const [events, setEvents] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast, ToastContainer } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Fetch events for dropdown
  useEffect(() => {
    // auth + events fetch
    (async () => {
      try {
        const sessionRes = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (sessionRes.status === 401) {
          addToast("Session expired. Please login.", "error");
          router.push("/admin/login");
          return;
        }
        const eventsRes = await fetch("/api/events", {
          credentials: "include",
        });
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data);
        }
      } catch (e) {
        console.error("Failed to load events/auth", e);
        addToast("Failed to load events", "error");
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("filename", file.name);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        if (uploadRes.status === 401) {
          addToast("Not authorized. Please login again.", "error");
          router.push("/admin/login");
          return;
        }
        if (!uploadRes.ok) {
          const detail = await uploadRes.json().catch(() => ({}));
          throw new Error(
            detail.error || `Upload failed (${uploadRes.status})`,
          );
        }
        const newBlob = await uploadRes.json();
        if (!newBlob?.url) throw new Error("Upload response missing url");

        const galleryRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: newBlob.url,
            title: imageData.title,
            caption: imageData.caption,
            eventId: imageData.eventId || undefined,
          }),
          credentials: "include",
        });
        if (!galleryRes.ok) {
          const gErr = await galleryRes.json().catch(() => ({}));
          throw new Error(gErr.error || `Save failed (${galleryRes.status})`);
        }
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error: any) {
        console.error("Error uploading file:", error);
        addToast(error.message || `Error uploading ${file.name}`, "error");
      }
    }

    setUploading(false);
    router.push("/admin/manage-gallery");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <Image className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Upload Gallery Images
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ToastContainer />
        <div className="mx-auto max-w-2xl">
          {/* File Upload Section */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Select Images
            </h2>

            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-orange-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-gray-600">
                Click to upload images or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                title="Select image files to upload"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900">
                  Selected Files ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded bg-gray-50 p-2"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Details Form */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Image Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="image-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="image-title"
                    type="text"
                    value={imageData.title}
                    onChange={(e) =>
                      setImageData({ ...imageData, title: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter image title"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="image-caption"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Caption
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="image-caption"
                    value={imageData.caption}
                    onChange={(e) =>
                      setImageData({ ...imageData, caption: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter image caption (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="image-date"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="image-date"
                      type="date"
                      value={imageData.date}
                      onChange={(e) =>
                        setImageData({ ...imageData, date: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      title="Select image date"
                      placeholder="Select date"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="image-event"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Event (Optional)
                  </label>
                  <select
                    id="image-event"
                    value={imageData.eventId}
                    onChange={(e) =>
                      setImageData({ ...imageData, eventId: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    title="Select event to associate with images"
                    aria-label="Select event"
                  >
                    <option value="">No specific event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Uploading...
              </h2>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {uploadProgress.toFixed(0)}% complete
              </p>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={
                uploading || files.length === 0 || !imageData.title.trim()
              }
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Uploading...
                </div>
              ) : (
                "Upload Images"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
