"use client";

import { useState, useEffect } from "react";
// Firebase removed: now using internal API routes (Prisma) + Vercel Blob upload
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Tag,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image?: string;
  author?: string;
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { addToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      const mapped = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        category: b.category,
        date: new Date(b.createdAt).toISOString().split("T")[0],
        image: b.image || undefined,
        author: "Admin", // author not stored yet
      }));
      setBlogs(mapped);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const blogData: BlogPost = {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      author: (formData.get("author") as string) || "Admin",
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
          throw new Error("Image upload failed");
        }
      }

      let resp: Response;
      if (editingBlog?.id) {
        resp = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: blogData.title,
            excerpt: blogData.excerpt,
            content: blogData.content,
            category: blogData.category,
            image: imageUrl !== undefined ? imageUrl : editingBlog.image,
          }),
          credentials: "include",
        });
      } else {
        resp = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: blogData.title,
            excerpt: blogData.excerpt,
            content: blogData.content,
            category: blogData.category,
            image: imageUrl,
          }),
          credentials: "include",
        });
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
      } else {
        addToast(
          editingBlog
            ? "Blog updated successfully"
            : "Blog created successfully",
          "success",
        );
      }

      // Reset form and refresh blogs
      setShowForm(false);
      setEditingBlog(null);
      fetchBlogs();

      // Reset form
      e.currentTarget.reset();
    } catch (error: any) {
      console.error("Error saving blog:", error);
      addToast(error.message || "Error saving blog", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const resp = await fetch(`/api/blogs/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || "Delete failed");
        }
        fetchBlogs();
        addToast("Blog deleted", "success");
      } catch (error: any) {
        console.error("Error deleting blog:", error);
        addToast(error.message || "Error deleting blog", "error");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
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
                <FileText className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Blogs
                </h1>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              <span>New Blog Post</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          /* Blog Form */
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingBlog?.title || ""}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingBlog?.category || ""}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      placeholder="e.g., News, Events, Impact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="blog-date"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Date *
                    </label>
                    <input
                      id="blog-date"
                      type="date"
                      name="date"
                      aria-required="true"
                      defaultValue={
                        editingBlog?.date ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      defaultValue={editingBlog?.author || "Admin"}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      placeholder="Author name"
                      title="Enter author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    rows={3}
                    defaultValue={editingBlog?.excerpt || ""}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Brief summary of the blog post"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    rows={10}
                    defaultValue={editingBlog?.content || ""}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    placeholder="Full blog content"
                  />
                </div>

                <div>
                  <label
                    htmlFor="blog-image"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Featured Image
                  </label>
                  <input
                    id="blog-image"
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    title="Select featured image for blog post"
                    placeholder="Select image"
                    aria-label="Featured image upload"
                  />
                  {editingBlog?.image && (
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
                    ) : editingBlog ? (
                      "Update Blog"
                    ) : (
                      "Create Blog"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Blog List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Published Blogs
              </h2>
              <p className="text-gray-600">{blogs.length} posts</p>
            </div>

            {blogs.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-md">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No blog posts yet
                </h3>
                <p className="mb-4 text-gray-600">
                  Create your first blog post to get started
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Create Blog Post
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="rounded-lg bg-white p-6 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {blog.title}
                          </h3>
                          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                            {blog.category}
                          </span>
                        </div>
                        <p className="mb-2 text-gray-600">{blog.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            {blog.date}
                          </span>
                          <span>by {blog.author}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(blog)}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(blog.id!)}
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
