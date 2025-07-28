// import { useState, useEffect } from "react";

// const SaveLoadModal = ({
//   onClose,
//   onSave,
//   onLoad,
//   currentDesign,
//   isSaving,
// }) => {
//   const [activeTab, setActiveTab] = useState("save");
//   const [designName, setDesignName] = useState("");
//   const [savedDesigns, setSavedDesigns] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Initialize design name with current design name
//   useEffect(() => {
//     if (currentDesign?.name) {
//       setDesignName(currentDesign.name);
//     }
//   }, [currentDesign]);

//   // Fetch saved designs when modal opens
//   useEffect(() => {
//     if (activeTab === "load") {
//       fetchSavedDesigns();
//     }
//   }, [activeTab]);

//   const fetchSavedDesigns = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/designs");
//       if (response.ok) {
//         const designs = await response.json();
//         setSavedDesigns(designs);
//       } else {
//         throw new Error("Failed to fetch designs");
//       }
//     } catch (error) {
//       console.error("Error fetching designs:", error);
//       alert("Error loading saved designs. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!designName.trim()) {
//       alert("Please enter a design name");
//       return;
//     }

//     await onSave(designName.trim());
//     onClose();
//   };

//   const handleLoad = async (designId) => {
//     await onLoad(designId);
//     onClose();
//   };

//   const handleDeleteDesign = async (designId, designName) => {
//     if (!confirm(`Are you sure you want to delete "${designName}"?`)) {
//       return;
//     }

//     try {
//       const response = await fetch(`/api/designs/${designId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setSavedDesigns(
//           savedDesigns.filter((design) => design.id !== designId)
//         );
//         alert("Design deleted successfully!");
//       } else {
//         throw new Error("Failed to delete design");
//       }
//     } catch (error) {
//       console.error("Error deleting design:", error);
//       alert("Error deleting design. Please try again.");
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold">Save & Load Designs</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//           >
//             ×
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab("save")}
//             className={`flex-1 py-3 px-4 text-sm font-medium ${
//               activeTab === "save"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Save Design
//           </button>
//           <button
//             onClick={() => setActiveTab("load")}
//             className={`flex-1 py-3 px-4 text-sm font-medium ${
//               activeTab === "load"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Load Design
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {activeTab === "save" && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Design Name
//                 </label>
//                 <input
//                   type="text"
//                   value={designName}
//                   onChange={(e) => setDesignName(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter design name..."
//                   maxLength={50}
//                 />
//               </div>

//               {currentDesign && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <p className="text-sm text-blue-800">
//                     This will {currentDesign.id ? "update" : "create"} the
//                     design:
//                     <span className="font-medium">
//                       {" "}
//                       {designName || "Untitled"}
//                     </span>
//                   </p>
//                 </div>
//               )}

//               <button
//                 onClick={handleSave}
//                 disabled={isSaving || !designName.trim()}
//                 className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving
//                   ? "Saving..."
//                   : currentDesign?.id
//                   ? "Update Design"
//                   : "Save Design"}
//               </button>
//             </div>
//           )}

//           {activeTab === "load" && (
//             <div>
//               {loading ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Loading designs...
//                   </p>
//                 </div>
//               ) : savedDesigns.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-4xl mb-4">📋</div>
//                   <p className="text-gray-500">No saved designs found</p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Create and save your first design!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {savedDesigns.map((design) => (
//                     <div
//                       key={design.id}
//                       className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <h3 className="font-medium text-gray-900">
//                             {design.name}
//                           </h3>
//                           <p className="text-sm text-gray-500">
//                             {design.components?.length || 0} components
//                           </p>
//                           <p className="text-xs text-gray-400">
//                             {design.metadata?.updated
//                               ? `Updated: ${formatDate(
//                                   design.metadata.updated
//                                 )}`
//                               : `Created: ${formatDate(
//                                   design.metadata?.created || design.created_at
//                                 )}`}
//                           </p>
//                         </div>
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleLoad(design.id)}
//                             className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
//                           >
//                             Load
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleDeleteDesign(design.id, design.name)
//                             }
//                             className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SaveLoadModal;
// app/builder/components/SaveLoadModal.js
import { useState, useEffect } from "react";

const SaveLoadModal = ({
  isOpen,
  onClose,
  onSave,
  onLoad,
  currentDesign,
  mode = "save", // 'save' or 'load'
}) => {
  const [designName, setDesignName] = useState("");
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && mode === "load") {
      fetchSavedDesigns();
    }
  }, [isOpen, mode]);

  const fetchSavedDesigns = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/designs?userId=default");
      const data = await response.json();

      if (data.success) {
        setSavedDesigns(data.designs);
      } else {
        setError(data.error || "Failed to load designs");
      }
    } catch (err) {
      setError("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!designName.trim()) {
      setError("Please enter a design name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: designName,
          components: currentDesign.components,
          userId: "default",
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave(data.design);
        setDesignName("");
        setError("");
        onClose();
      } else {
        setError(data.error || "Failed to save design");
      }
    } catch (err) {
      setError("Failed to save design");
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (design) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/designs/${design.id}`);
      const data = await response.json();

      if (data.success) {
        onLoad(data.design);
        onClose();
      } else {
        setError(data.error || "Failed to load design");
      }
    } catch (err) {
      setError("Failed to load design");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (designId) => {
    if (!confirm("Are you sure you want to delete this design?")) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/designs/${designId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setSavedDesigns(savedDesigns.filter((d) => d.id !== designId));
      } else {
        setError(data.error || "Failed to delete design");
      }
    } catch (err) {
      setError("Failed to delete design");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "save" ? "Save Design" : "Load Design"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        {mode === "save" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Design Name
              </label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter design name..."
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading || !designName.trim()}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading designs...</p>
              </div>
            ) : savedDesigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No saved designs found</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {savedDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="p-3 border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{design.name}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {design.components.length} components
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoad(design)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveLoadModal;
