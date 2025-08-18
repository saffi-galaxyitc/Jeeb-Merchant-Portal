import { useEffect, useState } from "react";
import MobileComponent from "./MobileComponent";
import { useJeebContext } from "@/app/context/JeebContext";

const PreviewModal = ({ pages, currentPageId, onClose }) => {
  const [previewPageId, setPreviewPageId] = useState(currentPageId);

  const currentPage = pages.find((page) => page.id === previewPageId);
  const components = currentPage?.components || [];
  const {
    handleComponentClick,
    updateComponentNavigation,
    updateImageNavigation,
    updateProductNavigation,
    updateItemNavigation,
  } = useJeebContext();

  // Close modal on ESC key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  useEffect(() => {
    setPreviewPageId(currentPageId);
  }, [currentPageId]);

  // Handle keyboard navigation between pages
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const currentIndex = pages.findIndex(
          (page) => page.id === previewPageId
        );

        if (event.key === "ArrowLeft" && currentIndex > 0) {
          setPreviewPageId(pages[currentIndex - 1].id);
        } else if (
          event.key === "ArrowRight" &&
          currentIndex < pages.length - 1
        ) {
          setPreviewPageId(pages[currentIndex + 1].id);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pages, previewPageId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="relative max-w-sm mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Page Navigation - Only show if multiple pages */}
        {pages.length > 1 && (
          <div className="absolute -top-16 left-0 right-0 flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                const currentIndex = pages.findIndex(
                  (page) => page.id === previewPageId
                );
                if (currentIndex > 0) {
                  setPreviewPageId(pages[currentIndex - 1].id);
                }
              }}
              disabled={
                pages.findIndex((page) => page.id === previewPageId) === 0
              }
              className="text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <select
                value={previewPageId}
                onChange={(e) => setPreviewPageId(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>

              <div className="text-white text-sm">
                {pages.findIndex((page) => page.id === previewPageId) + 1} of{" "}
                {pages.length}
              </div>
            </div>

            <button
              onClick={() => {
                const currentIndex = pages.findIndex(
                  (page) => page.id === previewPageId
                );
                if (currentIndex < pages.length - 1) {
                  setPreviewPageId(pages[currentIndex + 1].id);
                }
              }}
              disabled={
                pages.findIndex((page) => page.id === previewPageId) ===
                pages.length - 1
              }
              className="text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Mobile Frame - Full Size */}
        <div className="relative bg-black rounded-[2rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-[375px] h-[667px] bg-white rounded-[1.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-11 bg-white flex items-center justify-between px-4 text-xs font-medium">
              <div className="flex items-center space-x-1">
                <span>9:41</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-6 h-3 border border-black rounded-sm">
                  <div className="w-4 h-1 bg-black rounded-sm mt-0.5 ml-0.5"></div>
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="h-[calc(100%-44px)] overflow-y-auto">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-sm">No components on this page</p>
                    <p className="text-xs mt-2 text-gray-500">
                      {currentPage?.name || "Current Page"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {components.map((component) => (
                    <div key={component.id} className="relative">
                      <MobileComponent
                        component={component}
                        isSelected={false}
                        onUpdate={() => {}} // No editing in preview
                        onDelete={() => {}} // No deleting in preview
                        isPreview={true}
                        handleComponentClick={handleComponentClick}
                        updateComponentNavigation={updateComponentNavigation}
                        updateImageNavigation={updateImageNavigation}
                        updateProductNavigation={updateProductNavigation}
                        updateItemNavigation={updateItemNavigation}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
        </div>

        {/* Page Indicators - Show dots for multiple pages */}
        {pages.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setPreviewPageId(page.id)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  page.id === previewPageId ? "bg-white" : "bg-gray-600"
                }`}
                title={page.name}
              />
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mt-4 text-white text-sm">
          <p>
            Press <kbd className="bg-gray-700 px-2 py-1 rounded">ESC</kbd> to
            close
            {pages.length > 1 && (
              <>
                <br />
                Use <kbd className="bg-gray-700 px-2 py-1 rounded">←</kbd>{" "}
                <kbd className="bg-gray-700 px-2 py-1 rounded">→</kbd> to
                navigate pages
              </>
            )}
          </p>
        </div>
      </div>

      {/* Background Click to Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default PreviewModal;
