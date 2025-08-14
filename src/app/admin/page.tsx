"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Shield,
  Upload,
  FileText,
  Image,
  Video,
  MessageSquare,
  Home,
  Settings,
} from "lucide-react";
import { logout } from "@/actions/auth";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [galleryCount, setGalleryCount] = useState<number>(0);
  const [videosCount, setVideosCount] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [blogsCount, setBlogsCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        const data = await res.json();
        setUser(data.user);

        // Only fetch data after successful authentication
        await Promise.all([
          fetchFeedbackCount(),
          fetchGalleryCount(),
          fetchVideosCount(),
          fetchEventsCount(),
          fetchBlogsCount(),
        ]);
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbackCount = async () => {
      try {
        const res = await fetch("/api/feedback", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFeedbackCount(data.feedbacks?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching feedback count:", error);
      }
    };

    const fetchGalleryCount = async () => {
      try {
        const res = await fetch("/api/gallery-list", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setGalleryCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching gallery count:", error);
      }
    };

    const fetchVideosCount = async () => {
      try {
        const res = await fetch("/api/videos", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setVideosCount(data.videos?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching videos count:", error);
      }
    };

    const fetchEventsCount = async () => {
      try {
        const res = await fetch("/api/events", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setEventsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching events count:", error);
      }
    };

    const fetchBlogsCount = async () => {
      try {
        const res = await fetch("/api/blogs", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setBlogsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching blogs count:", error);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user.displayName || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <AdminNavbar />

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Manage your content and media</p>
        </div>

        {/* Admin Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <MessageSquare className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {feedbackCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Messages
            </h3>
            <p className="text-sm text-gray-600">Total feedback received</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Image className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {galleryCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Gallery Images
            </h3>
            <p className="text-sm text-gray-600">Total images uploaded</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Video className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {videosCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Videos</h3>
            <p className="text-sm text-gray-600">Total videos uploaded</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <FileText className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {blogsCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
            <p className="text-sm text-gray-600">Published articles</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Upload className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">
                {eventsCount}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Events</h3>
            <p className="text-sm text-gray-600">Active events</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/manage-feedback"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Feedback
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              View and respond to contact messages and feedback
            </p>
          </a>

          <a
            href="/admin/upload-gallery"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <Image className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Gallery Images
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Add new images to your gallery with captions and event
              associations
            </p>
          </a>

          <a
            href="/admin/upload-videos"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <Video className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Videos
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Upload and manage video content for your website
            </p>
          </a>

          <a
            href="/admin/manage-blogs"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <FileText className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Blogs
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Create, edit, and publish blog posts
            </p>
          </a>

          <a
            href="/admin/manage-events"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <Upload className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Events
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Add and update event information
            </p>
          </a>

          <a
            href="/admin/settings"
            className="block rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center space-x-3">
              <Shield className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure admin settings and preferences
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
