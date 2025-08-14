"use client";

import { useState, useEffect } from "react";
// Firebase removed: now using internal API routes with Prisma + Vercel Blob
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Upload,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface Event {
  id?: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  image?: string;
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (res.status === 401) {
          addToast("Session expired. Please login.", "error");
          router.push("/admin/login");
          return;
        }
        await fetchEvents();
      } catch (e) {
        console.error("Auth check failed", e);
        addToast("Authentication check failed", "error");
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      // map prisma Event model to local Event interface
      const mapped = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        date: e.date?.split("T")[0] || "",
        time: e.time || "",
        location: e.location,
        description: e.description,
        image: e.image || undefined,
      }));
      setEvents(mapped);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const eventData: Event = {
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      time: (formData.get("time") as string) || "00:00",
      location: formData.get("location") as string,
      description: (formData.get("description") as string) || "",
    };

    setUploading(true);

    try {
      // Image upload via /api/upload
      const imageFile = formData.get("image") as File;
      let imageUrl: string | undefined = undefined;
      if (imageFile && imageFile.size > 0) {
        const fd = new FormData();
        fd.append("file", imageFile);
        fd.append("filename", imageFile.name);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        } else {
          if (uploadRes.status === 401) {
            addToast("Not authorized. Please login again.", "error");
            router.push("/admin/login");
            return;
          }
          const detail = await uploadRes.json().catch(() => ({}));
          throw new Error(
            detail.error || `Image upload failed (${uploadRes.status})`,
          );
        }
      }

      let resp: Response | undefined;
      if (editingEvent?.id) {
        resp = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            image: imageUrl !== undefined ? imageUrl : editingEvent.image,
          }),
          credentials: "include",
        });
      } else {
        resp = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            image: imageUrl,
          }),
          credentials: "include",
        });
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 401) {
          addToast("Session expired. Please login.", "error");
          router.push("/admin/login");
          return;
        }
        throw new Error(err.error || "Request failed");
      } else {
        addToast(
          editingEvent
            ? "Event updated successfully"
            : "Event created successfully",
          "success",
        );
      }

      // Reset form and refresh events
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();

      // Reset form
      e.currentTarget.reset();
    } catch (error: any) {
      console.error("Error saving event:", error);
      addToast(error.message || "Error saving event", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const resp = await fetch(`/api/events/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || "Delete failed");
        }
        fetchEvents();
        addToast("Event deleted", "success");
      } catch (error: any) {
        console.error("Error deleting event:", error);
        addToast(error.message || "Error deleting event", "error");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <Calendar className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Events
                </h1>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              <span>New Event</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          /* Event Form */
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingEvent?.title || ""}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={
                        editingEvent?.date ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      title="Select event date"
                      placeholder="Select date"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingEvent?.location || ""}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      placeholder="Enter event location"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      defaultValue={editingEvent?.time || "12:00"}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      placeholder="Event time"
                    />
                  </div>
                </div>
                <ToastContainer />

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editingEvent?.description || ""}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Enter event description (optional)"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Event Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    title="Select event image"
                    placeholder="Choose image file"
                  />
                  {editingEvent?.image && (
                    <p className="mt-1 text-sm text-gray-500">
                      Current image will be replaced if a new one is selected
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : editingEvent ? (
                      "Update Event"
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Events List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                All Events
              </h2>
              <p className="text-gray-600">{events.length} events</p>
            </div>

            {events.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-md">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No events yet
                </h3>
                <p className="mb-4 text-gray-600">
                  Create your first event to get started
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="overflow-hidden rounded-lg bg-white shadow-md"
                  >
                    <div className="relative h-48">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-orange-500" />
                          {event.location}
                        </div>
                      </div>
                      {event.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                          {event.description}
                        </p>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id!)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
