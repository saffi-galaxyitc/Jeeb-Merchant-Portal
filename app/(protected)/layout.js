"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { JeebContextProvider } from "../context/JeebContext";
import PaymentModal from "../components/PaymentModal";
import { getCookie } from "cookies-next";
import { useAuth } from "../mainContext/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProductProvider } from "../mainContext/ProductContext";

export default function ProtectedLayout({ children }) {
  const { handleAuthentication, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status from cookies and localStorage
    const cookieAuth = getCookie("authenticated");
    const localStorageAuth = localStorage.getItem("authenticated");

    const isAuth = cookieAuth === "true" || localStorageAuth === "true";

    if (!isAuth) {
      router.push("/signin");
    } else {
      // Update context if needed
      if (!authenticated) {
        handleAuthentication(true);
      }
    }
  }, [router, handleAuthentication, authenticated]);

  // Show loading or nothing while checking authentication
  // if (!authenticated) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   );
  // }
  return (
    <div className="flex h-screen">
      <JeebContextProvider>
        <ProductProvider>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar />
            <PaymentModal />
            <main className="overflow-auto">{children}</main>
          </div>
        </ProductProvider>
      </JeebContextProvider>
    </div>
  );
}
