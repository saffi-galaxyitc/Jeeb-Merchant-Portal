import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { componentCategories } from "@/lib/utils";
import { Search } from "lucide-react";
const ComponentPalette = ({ onAddComponent }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Deep search in categories + components
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return componentCategories;

    const lowerQuery = searchQuery.toLowerCase();

    return componentCategories
      .map((category) => {
        const matchedComponents = category.components.filter((component) => {
          return (
            component.name.toLowerCase().includes(lowerQuery) ||
            component.type.toLowerCase().includes(lowerQuery) ||
            component.description.toLowerCase().includes(lowerQuery) ||
            category.name.toLowerCase().includes(lowerQuery)
          );
        });

        if (matchedComponents.length > 0) {
          return { ...category, components: matchedComponents };
        }
        return null;
      })
      .filter(Boolean); // remove null categories
  }, [searchQuery]);
  return (
    <div className="space-y-6">
      <div className="relative w-auto mb-4">
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>
      {filteredCategories.map((category) => (
        <div key={category.name}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.components.map((component) => (
              <div
                key={component.type}
                onClick={() => onAddComponent(component.type)}
                className="relative w-32 h-32 border-2 border-dashed border-blue-600 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 group"
              >
                <h4 className="absolute top-1 left-1 font-medium text-xs text-gray-800 bg-white px-2 py-1 rounded hidden group-hover:block transition-opacity duration-200">
                  {component.name}
                </h4>
                <img
                  src={component.icon}
                  alt={`${component.name} icon`}
                  className="w-24 h-24 object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-sm text-blue-800 mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Drag components to reorder them</li>
          <li>• Preview your design frequently</li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentPalette;
