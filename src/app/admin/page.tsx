"use client";

import { useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Upload, FileText, Image, Video } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
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

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Manage your content and media</p>
        </div>

        {/* Admin Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Image className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">24</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Gallery Images
            </h3>
            <p className="text-sm text-gray-600">Total images uploaded</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Video className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">8</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Videos</h3>
            <p className="text-sm text-gray-600">Total videos uploaded</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <FileText className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Blog Posts</h3>
            <p className="text-sm text-gray-600">Published articles</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <Upload className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Events</h3>
            <p className="text-sm text-gray-600">Active events</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
