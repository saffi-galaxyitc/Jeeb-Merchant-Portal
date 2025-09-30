"use client";

import SettingsForm from "./SettingsForm";

export default function SettingsPage() {
  // Filter products based on search and filters

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black px-6 py-8 flex flex-col justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-white-400">Manage Profile & Appearance.</p>
        </div>
        <div className="w-full mt-6 px-6 py-4 bg-white rounded-lg">
          <SettingsForm />
        </div>
      </div>
    </div>
  );
}
