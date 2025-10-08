"use client";

import { useJeebContext } from "@/app/context/JeebContext";
import { ArrowLeft, Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import JeebTestflightDialog from "./JeebTestflightDialog";
const Button = ({
  children,
  variant = "default",
  size = "default",
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center cursor-pointer justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 font-bold bg-gray-300",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    borderless:
      "text-blue-700 bg-transparent hover:border hover:border-blue-700",
    textOnly: "text-black bg-transparent",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default function Navbar() {
  const { setShowPreview, navItems, openPaymentModal } = useJeebContext();
  const pathname = usePathname();
  const router = useRouter();

  // Find the current page label
  const currentPage = navItems.find((item) => pathname.startsWith(item.href));
  return (
    <header className="w-full h-18 bg-white border-b px-4 py-2 flex items-center justify-between">
      {/* Left side: optional title or icon */}
      <div className="ml-auto">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <Button variant="outline" size="sm">
            {currentPage ? currentPage.label : ""}
          </Button>
        </div>
      </div>

      {/* Right side: user-related icons */}
      <div className="flex items-center sm:gap-4 gap-1 ml-auto">
        <Button
          size="sm"
          variant="textOnly"
          onClick={() => setShowPreview(true)}
        >
          <Play></Play>
        </Button>
        <Button size="sm" onClick={openPaymentModal}>
          Publish
        </Button>
        <JeebTestflightDialog />
      </div>
    </header>
  );
}
