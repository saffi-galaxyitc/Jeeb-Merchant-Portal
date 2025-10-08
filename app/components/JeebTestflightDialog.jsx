import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, TestTube } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

export default function JeebTestflightDialog() {
  const [activeTab, setActiveTab] = useState("install");
  const [selectedStore, setSelectedStore] = useState(null);

  // Example URLs (replace with your actual install and test URLs)
  const urls = {
    google: "https://play.google.com/store/apps/details?id=com.jeeb.testflight",
    apple: "https://testflight.apple.com/join/jeeb-app",
    test: "https://jeeb.app/test-api-login",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-blue-600 bg-white border-1 border-blue-600 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200">
          Jeeb Testflight
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Jeeb Testflight Access
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose an option to either install the Jeeb Testflight app or test
            using your API key.
          </p>
        </DialogHeader>

        {/* Option Buttons */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            onClick={() => {
              setActiveTab("install");
              setSelectedStore(null);
            }}
            className={`flex items-center gap-2 transition duration-200 disabled:opacity-50 ${
              activeTab === "install"
                ? "bg-blue-600 text-white border border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
            }`}
          >
            <Smartphone size={16} /> Install
          </Button>
          <Button
            onClick={() => {
              setActiveTab("test");
              setSelectedStore(null);
            }}
            className={`flex items-center gap-2 transition duration-200 disabled:opacity-50 ${
              activeTab === "test"
                ? "bg-blue-600 text-white border border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1"
                : "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50"
            }`}
          >
            <TestTube size={16} /> Test
          </Button>
        </div>

        <Separator className="my-4" />

        {/* INSTALL MODE */}
        {activeTab === "install" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Choose your platform to download the Jeeb Testflight app.
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setSelectedStore("google")}
                className={`transition-transform ${
                  selectedStore === "google"
                    ? "scale-110"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src="/Images/google-play-icon.png"
                  alt="Google Play"
                  width={60}
                  height={60}
                />
              </button>
              <button
                onClick={() => setSelectedStore("apple")}
                className={`transition-transform ${
                  selectedStore === "apple"
                    ? "scale-110"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src="/Images/app-store-icon.png"
                  alt="App Store"
                  width={60}
                  height={60}
                />
              </button>
            </div>

            {selectedStore && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm mb-3">
                  Scan this QR code to install Jeeb Testflight from{" "}
                  {selectedStore === "google" ? "Google Play" : "App Store"}.
                </p>
                <div className="border rounded-xl p-3 bg-white">
                  <QRCodeCanvas
                    value={urls[selectedStore]}
                    size={160}
                    includeMargin
                    level="H"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Or visit:{" "}
                  <a
                    href={urls[selectedStore]}
                    className="underline text-blue-600"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {urls[selectedStore]}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* TEST MODE */}
        {activeTab === "test" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Use your Jeeb app to scan this QR code and log in with your API
              key.
            </p>

            <div className="flex justify-center">
              <div className="border rounded-xl p-3 bg-white">
                <QRCodeCanvas
                  value={urls.test}
                  size={160}
                  includeMargin
                  level="H"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              In the Jeeb Testflight app → tap <strong>“Scan to Test”</strong> →
              scan this QR to connect.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
