"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Video,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getEvents } from "@/actions/getEvents";

interface VideoData {
  title: string;
  description: string;
  date: string;
  eventId?: string;
}

export default function UploadVideosPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoData, setVideoData] = useState<VideoData>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    eventId: "",
  });
  const [events, setEvents] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch events for dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getEvents();
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one video file to upload.");
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        });

        const newBlob = await response.json();

        // Now, save the blob URL to your database
        await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: newBlob.url,
            title: videoData.title,
            description: videoData.description,
            eventId: videoData.eventId,
          }),
        });
      }

      // Reset form
      setFiles([]);
      setVideoData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        eventId: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Videos uploaded successfully!");
      router.push("/admin/manage-videos");
    } catch (error) {
      console.error("Error uploading videos:", error);
      alert("Error uploading videos. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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
              <Video className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Upload Videos
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* File Upload Section */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Select Videos
            </h2>

            <div
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-orange-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-gray-600">
                Click to upload videos or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                MP4, MOV, AVI up to 100MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                title="Select video files to upload"
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

          {/* Video Details Form */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Video Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="video-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="video-title"
                    type="text"
                    value={videoData.title}
                    onChange={(e) =>
                      setVideoData({ ...videoData, title: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter video title"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="video-description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 pt-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="video-description"
                    value={videoData.description}
                    onChange={(e) =>
                      setVideoData({
                        ...videoData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter video description (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="video-date"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="video-date"
                      type="date"
                      value={videoData.date}
                      onChange={(e) =>
                        setVideoData({ ...videoData, date: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      title="Select video date"
                      placeholder="Select date"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="video-event"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Event (Optional)
                  </label>
                  <select
                    id="video-event"
                    value={videoData.eventId}
                    onChange={(e) =>
                      setVideoData({ ...videoData, eventId: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    title="Select event to associate with videos"
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
                uploading || files.length === 0 || !videoData.title.trim()
              }
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Uploading...
                </div>
              ) : (
                "Upload Videos"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
