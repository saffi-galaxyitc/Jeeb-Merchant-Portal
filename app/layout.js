import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./mainContext/AuthContext";
import { ToastContainer } from "react-toastify";
import { ResetProvider } from "./mainContext/ResetContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Galaxy Cart",
  description:
    "Galaxy Cart is an application powered by Galaxy Solutions Itc, used to onboard merchants to help design the generate their very own e-commerce mobile application where they can sell there products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ResetProvider>
          <AuthProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <Toaster />
            {children}
          </AuthProvider>
        </ResetProvider>
      </body>
    </html>
  );
}
