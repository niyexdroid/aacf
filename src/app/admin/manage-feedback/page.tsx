"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import AdminNavbar from "@/components/AdminNavbar";

interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ManageFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setFeedbacks((prev) =>
          prev.map((feedback) =>
            feedback.id === id ? { ...feedback, status } : feedback,
          ),
        );
        if (selectedFeedback?.id === id) {
          setSelectedFeedback((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));
        if (selectedFeedback?.id === id) {
          setSelectedFeedback(null);
        }
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => statusFilter === "all" || feedback.status === statusFilter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Manage Feedback
          </h1>
          <p className="text-gray-600">
            View and manage contact form submissions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter feedback by status"
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
          </select>

          <Button onClick={fetchFeedbacks} variant="outline">
            Refresh
          </Button>

          <div className="text-sm text-gray-500">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Feedback List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white shadow">
              <div className="border-b p-4">
                <h2 className="font-semibold text-gray-900">Feedback List</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 ${
                      selectedFeedback?.id === feedback.id
                        ? "border-blue-200 bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="truncate font-medium text-gray-900">
                        {feedback.name}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(feedback.status)}`}
                      >
                        {feedback.status}
                      </span>
                    </div>
                    <p className="mb-1 text-sm text-gray-600">
                      {feedback.email}
                    </p>
                    <p className="mb-2 truncate text-sm font-medium text-gray-800">
                      {feedback.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}{" "}
                      {new Date(feedback.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}

                {filteredFeedbacks.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No feedbacks found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Details */}
          <div className="lg:col-span-2">
            {selectedFeedback ? (
              <div className="rounded-lg border bg-white shadow">
                <div className="border-b p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedFeedback.subject}
                      </h2>
                      <p className="text-gray-600">
                        From: {selectedFeedback.name}
                      </p>
                      <p className="text-gray-600">
                        Email: {selectedFeedback.email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedFeedback.status)}`}
                    >
                      {selectedFeedback.status}
                    </span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() =>
                        updateFeedbackStatus(selectedFeedback.id, "read")
                      }
                      variant="outline"
                      disabled={selectedFeedback.status === "read"}
                    >
                      Mark as Read
                    </Button>
                    <Button
                      onClick={() =>
                        updateFeedbackStatus(selectedFeedback.id, "resolved")
                      }
                      variant="outline"
                      disabled={selectedFeedback.status === "resolved"}
                    >
                      Mark as Resolved
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(
                          `mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject}`,
                        )
                      }
                      variant="outline"
                    >
                      Reply
                    </Button>
                    <Button
                      onClick={() => deleteFeedback(selectedFeedback.id)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 font-medium text-gray-900">Message:</h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-gray-800">
                      {selectedFeedback.message}
                    </p>
                  </div>

                  <div className="mt-6 border-t pt-4 text-sm text-gray-500">
                    <p>
                      Received:{" "}
                      {new Date(selectedFeedback.createdAt).toLocaleString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(selectedFeedback.updatedAt).toLocaleString()}
                    </p>
                    <p>Feedback ID: {selectedFeedback.id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg border bg-white shadow">
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p>Select a feedback to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
