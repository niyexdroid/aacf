"use client";

import { useToast } from "@/components/Toast";

/**
 * Client-side component that renders toast notifications
 * Must be a client component to use React hooks
 */
export function ToastPortalClient() {
  const { toasts, hideToast } = useToast();

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="assertive"
          className={`animate-slide-in pointer-events-auto relative min-w-[320px] max-w-md rounded-lg p-4 pr-10 shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : toast.type === "error"
                ? "bg-red-600 text-white"
                : toast.type === "warning"
                  ? "bg-yellow-600 text-white"
                  : "bg-blue-600 text-white"
          } `}
        >
          <button
            onClick={() => hideToast(toast.id)}
            className="absolute right-2 top-2 text-white transition-opacity hover:opacity-80"
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <p className="pr-6 font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
