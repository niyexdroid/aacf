"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Image,
  Video,
  FileText,
  Upload,
  Settings,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  {
    href: "/admin/manage-feedback",
    label: "Manage Feedback",
    icon: MessageSquare,
  },
  { href: "/admin/upload-gallery", label: "Gallery", icon: Image },
  { href: "/admin/upload-videos", label: "Videos", icon: Video },
  { href: "/admin/manage-blogs", label: "Blogs", icon: FileText },
  { href: "/admin/manage-events", label: "Events", icon: Upload },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-orange-600 bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
