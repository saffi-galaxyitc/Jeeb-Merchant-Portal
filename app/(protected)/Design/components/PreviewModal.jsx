import { useEffect, useState } from "react";
import MobileComponent from "./MobileComponent";
import { useJeebContext } from "@/app/context/JeebContext";
import { HashLoader } from "react-spinners";
import MobileNavBar from "./MobileNavBar";

const PreviewModal = ({
  pages,
  currentPageId,
  onClose,
  scale,
  isLoadingTemplates,
  isLoadingPages,
  isLoadingComponents,
  increaseScale,
  decreaseScale,
  currentPage,
}) => {
  const [previewPageId, setPreviewPageId] = useState(currentPageId);

  const components = currentPage?.components || [];
  const {
    handleComponentClick,
    updateComponentNavigation,
    updateImageNavigation,
    updateProductNavigation,
    updateItemNavigation,
    goBack,
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
    <div className="fixed inset-0 bg-transparent backdrop-blur-md z-50 overflow-y-auto">
      {/* Modal Container */}
      <div className="relative flex flex-col items-center max-w-sm mx-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 text-black text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Page Navigation - Only show if multiple pages */}
        {pages.length > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-4">
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
              className="text-black hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
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
                onChange={(e) => setPreviewPageId(Number(e.target.value))}
                className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a page
                </option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>

              <div className="text-black text-sm">
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
              className="text-black hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
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
        <div className="flex items-center gap-2 mx-2 w-auto my-4">
          <button
            onClick={decreaseScale}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <span className="text-sm font-medium">{scale}%</span>
          <button
            onClick={increaseScale}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
        <div className="relative m-0 p-0">
          {/* Mobile Frame - Full Size */}
          <div
            className="relative bg-black rounded-[2rem] p-2 shadow-2xl"
            style={{
              transform: `scale(${scale / 100})`,
            }}
          >
            {/* Screen */}
            <div
              className="w-[425px] h-[767px] bg-white rounded-tl-[1.5rem] rounded-tr-[1.5rem] overflow-hidden relative"
              style={{ marginBottom: "72px" }}
            >
              {/* Status Bar */}
              <div className="h-11 bg-white flex items-center justify-between px-4 text-xs font-medium border-b border-gray-100">
                <div className="flex items-center space-x-1">
                  <span>9:41</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs">📶</span>
                  <span className="text-xs">📶</span>
                  <span className="text-xs">🔋</span>
                </div>
              </div>
              {/* Navigation Bar for go back, page title and search  */}
              {currentPage?.type === "SubCategory" && (
                <MobileNavBar goBack={goBack} title={currentPage?.name} />
              )}
              {/* App Content */}
              <div className="h-[calc(100%-44px)] overflow-y-auto bg-gray-100">
                {components.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    {isLoadingTemplates ||
                    isLoadingPages ||
                    isLoadingComponents ? (
                      <div className="flex flex-col items-center space-y-4">
                        <HashLoader
                          color="oklch(62.3% 0.214 259.815)"
                          size={50}
                        />

                        {isLoadingTemplates && (
                          <p className="text-sm font-medium">
                            Loading templates...
                          </p>
                        )}
                        {isLoadingPages && (
                          <p className="text-sm font-medium">
                            Loading pages...
                          </p>
                        )}
                        {isLoadingComponents && (
                          <p className="text-sm font-medium">
                            Loading components...
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-sm">No components on this page</p>
                        <p className="text-xs mt-2 text-gray-500">
                          {currentPage?.name || "Current Page"}
                        </p>
                      </div>
                    )}
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

            {/* Nav Bar */}
            <div className="absolute bottom-2 z-30 left-1/2 transform -translate-x-1/2 w-[426px] bg-white rounded-bl-[1.55rem] rounded-br-[1.55rem] border px-8 py-3 flex items-center h-18 justify-between gap-4">
              <div className="flex flex-col items-center">
                <img src="/images/home.png" alt="Home" className="w-7 h-7" />
                <span className="text-sm font-bold text-blue-500">Home</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/images/cart.png" alt="Cart" className="w-6 h-6" />
                <span className="text-sm font-semibold text-gray-500">
                  Cart
                </span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/images/more.png" alt="More" className="w-6 h-6" />
                <span className="text-sm font-semibold text-gray-500">
                  More
                </span>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 z-40 left-1/2 transform -translate-x-1/2 w-44 h-1 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Page Indicators - Show dots for multiple pages */}
        {pages.length > 1 && (
          <div className="flex justify-center mb-8 space-x-2">
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
        {/* <div className="text-center mt-4 text-white text-sm">
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
        </div> */}
      </div>

      {/* Background Click to Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default PreviewModal;
