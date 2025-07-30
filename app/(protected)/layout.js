"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { JeebContextProvider } from "../context/JeebContext";
import PaymentModal from "../components/PaymentModal";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex h-screen">
      <JeebContextProvider>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <PaymentModal />
          <main className="overflow-auto">{children}</main>
        </div>
      </JeebContextProvider>
    </div>
  );
}
