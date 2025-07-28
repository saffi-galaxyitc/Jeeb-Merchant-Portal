"use client";

import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b px-4 py-2 flex items-center justify-between">
      {/* Left side: optional title or icon */}
      <div></div>

      {/* Right side: user-related icons */}
      <div className="flex items-center gap-4">
        <button className="hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hover:text-blue-600 transition-colors">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
