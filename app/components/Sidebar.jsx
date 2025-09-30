"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; // ShadCN's utility for classnames
import { usePathname } from "next/navigation";
import { ProfileItem } from "@/app/(protected)/design/components/ProfileItem.jsx";
import { useJeebContext } from "../context/JeebContext";
import { useAuth } from "../mainContext/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { navItems } = useJeebContext();
  const { handleLogout } = useAuth();
  return (
    <aside className="h-screen w-20 bg-white text-black flex flex-col items-center justify-center py-4 space-y-4 border-r border-gray-200">
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
        <ProfileItem handleLogout={handleLogout} />
      </div>
    </aside>
  );
}
