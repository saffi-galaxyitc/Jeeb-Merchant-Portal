import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import PageSections from "./PageSections";

const PageManager = ({
  pages,
  currentPageId,
  onAddPage,
  onDeletePage,
  onRenamePage,
  onSwitchPage,
  onDuplicatePage,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
}) => {
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showPageMenu, setShowPageMenu] = useState(null);
  const [showSections, setShowSections] = useState(false);
  console.log("pages", pages);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const handleAddItem = () => {
    if (newLabel.trim()) {
      setItems((prev) => [...prev, newLabel.trim()]);
      setNewLabel("");
      setOpen(false);
    }
  };
  const handleRemoveSection = (id, e) => {
    console.log("remove section");
    e.stopPropagation();
    onDeleteComponent(id);
  };
  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };
  const handleStartEditing = (page) => {
    setEditingPageId(page.id);
    setEditingName(page.name);
    setShowPageMenu(null);
  };
  const handleSaveEdit = () => {
    if (editingName.trim()) {
      onRenamePage(editingPageId, editingName.trim());
    }
    setEditingPageId(null);
    setEditingName("");
  };
  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingName("");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };
  useEffect(() => {
    const currentPage = pages.find((page) => page.id === currentPageId);

    if (currentPage && currentPage.components?.length > 0) {
      setShowSections(true);
    } else {
      setShowSections(false);
    }
  }, [pages, currentPageId]);

  return (
    <div className="space-y-3 mx-4">
      <div className="relative w-auto">
        <Input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
      <div className="flex my-4 items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500">Pages</h3>
        <button
          onClick={onAddPage}
          className="p-1 bg-blue-500 text-neutral-50 hover:bg-neutral-50 hover:text-blue-500 hover:border-blue-500 border-2 border-transparent rounded transition-colors"
          title="Add new page"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-1 max-h-64 h-64 overflow-y-auto border-b border-gray-200">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`group relative rounded-lg transition-all ${
              page.id === currentPageId
                ? "bg-gray-100"
                : "hover:border-gray-100 hover:border-1 bg-white"
            }`}
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex-1 min-w-0">
                {editingPageId === page.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={(e) => {
                      if (
                        !e.relatedTarget ||
                        !e.relatedTarget.closest(".context-menu")
                      ) {
                        handleSaveEdit();
                      }
                    }}
                    className="w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => {
                      if (!showPageMenu) onSwitchPage(page.id);
                    }}
                    className="w-full text-left text-sm font-medium text-gray-900 truncate"
                  >
                    {page.name}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPageMenu(
                          showPageMenu === page.id ? null : page.id
                        );
                        setEditingPageId(null); // close any active edit
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-48 p-2"
                    align="end"
                    side="bottom"
                  >
                    <div className="py-1 space-y-1">
                      <button
                        onClick={() => handleStartEditing(page)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Rename</span>
                      </button>

                      <button
                        onClick={() => {
                          onDuplicatePage(page.id);
                          setShowPageMenu(null);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Duplicate</span>
                      </button>

                      {pages.length > 1 && (
                        <button
                          onClick={() => {
                            onDeletePage(page.id);
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* <div className="px-3 pb-2">
              <span className="text-xs text-gray-500">
                {page.components.length} component
                {page.components.length !== 1 ? "s" : ""}
              </span>
            </div> */}
          </div>
        ))}
      </div>
      {showSections && (
        <PageSections
          pages={pages}
          currentPageId={currentPageId}
          open={open}
          setOpen={setOpen}
          newLabel={newLabel}
          setNewLabel={setNewLabel}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleRemoveSection={handleRemoveSection}
          selectedComponent={selectedComponent}
          onSelectComponent={onSelectComponent}
          items={items}
        />
      )}

      {showPageMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowPageMenu(null);
            setEditingPageId(null);
          }}
        />
      )}
    </div>
  );
};

export default PageManager;
