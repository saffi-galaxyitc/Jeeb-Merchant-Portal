"use client";

import { SplinePointer, LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // ShadCN's utility for classnames
import { usePathname } from "next/navigation";
import { ProfileItem } from "@/app/(protected)/Design/components/ProfileItem";

const navItems = [
  { href: "/Design", icon: SplinePointer, label: "Design" },
  { href: "/Products", icon: LayoutDashboard, label: "Products" },
  { href: "/Settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-16 bg-white text-black flex flex-col items-center justify-center py-4 space-y-4 border-r border-gray-200">
      <div className="flex flex-col items-center justify-center mt-8">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} passHref>
            <div
              className={cn(
                "p-3 my-4 rounded-full hover:bg-blue-500 hover:text-white bg-white hover:bg-blue-500 transition-all",
                pathname === href && "bg-blue-500 text-neutral-50"
              )}
              title={label}
            >
              <Icon className="w-6 h-6" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <ProfileItem />
        {/* <button
          title="Logout"
          className="p-3 rounded-lg hover:bg-red-600 transition-all"
          onClick={() => {
            // handle logout here
          }}
        >
          <LogOut className="w-5 h-5" />
        </button> */}
      </div>
    </aside>
  );
}
