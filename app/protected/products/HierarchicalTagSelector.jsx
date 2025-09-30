import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Search, X, Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

const HierarchicalTagSelector = ({
  tags = [],
  selectedTags = [],
  onTagsChange,
  searchTerm = "",
  onSearchChange,
  onSearch, // New prop for API search function
  loading = false,
  placeholder = "Search tags...",
  searchDebounceMs = 300, // Debounce delay for API calls
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect for API calls
  useEffect(() => {
    if (!onSearch) return;

    // If cleared → reset immediately
    if (!searchTerm.trim()) {
      onSearch(""); // reload default tags
      setIsSearching(false);
      return;
    }

    // Debounced search for non-empty queries
    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        await onSearch(searchTerm);
      } catch (error) {
        console.error("Search API error:", error);
      } finally {
        setIsSearching(false);
      }
    }, searchDebounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch, searchDebounceMs]);

  // Filter tags based on search term (client-side fallback if no API search)
  const filteredTags = useMemo(() => {
    // If API search is provided, don't filter client-side - API handles filtering
    if (onSearch) return tags;

    // Client-side filtering as fallback
    if (!searchTerm.trim()) return tags;

    return tags
      .map((group) => ({
        ...group,
        values: group.values.filter((tag) =>
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.values.length > 0);
  }, [tags, searchTerm, onSearch]);

  // Handle individual tag selection
  const handleTagSelect = (tagValue) => {
    const isSelected = selectedTags.some((tag) => tag.id === tagValue.id);
    let newSelectedTags;

    if (isSelected) {
      newSelectedTags = selectedTags.filter((tag) => tag.id !== tagValue.id);
    } else {
      newSelectedTags = [...selectedTags, tagValue];
    }

    onTagsChange(newSelectedTags);
  };

  // Handle group selection (select/deselect all tags in group)
  const handleGroupSelect = (group, checked) => {
    let newSelectedTags = [...selectedTags];

    if (checked) {
      // Add all group values that aren't already selected
      group.values.forEach((tagValue) => {
        if (!selectedTags.some((tag) => tag.id === tagValue.id)) {
          newSelectedTags.push(tagValue);
        }
      });
    } else {
      // Remove all group values
      newSelectedTags = selectedTags.filter(
        (selectedTag) =>
          !group.values.some((groupTag) => groupTag.id === selectedTag.id)
      );
    }

    onTagsChange(newSelectedTags);
  };

  // Check if all tags in a group are selected
  const isGroupFullySelected = (group) => {
    return (
      group.values.length > 0 &&
      group.values.every((tagValue) =>
        selectedTags.some((selected) => selected.id === tagValue.id)
      )
    );
  };

  // Check if some tags in a group are selected
  const isGroupPartiallySelected = (group) => {
    const selectedCount = group.values.filter((tagValue) =>
      selectedTags.some((selected) => selected.id === tagValue.id)
    ).length;
    return selectedCount > 0 && selectedCount < group.values.length;
  };

  // Remove selected tag
  const removeSelectedTag = (tagToRemove) => {
    const newSelectedTags = selectedTags.filter(
      (tag) => tag.id !== tagToRemove.id
    );
    onTagsChange(newSelectedTags);
  };

  // Clear all selected tags
  const clearAllTags = () => {
    onTagsChange([]);
  };

  // Get selected count for a group
  const getGroupSelectedCount = (group) => {
    return group.values.filter((v) => selectedTags.some((s) => s.id === v.id))
      .length;
  };

  return (
    <div className="w-full space-y-3">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full flex-col items-start justify-between rounded-md border-1 border-gray-700 text-gray-700 bg-gray-100 px-4 py-[7px] cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {selectedTags.length > 0
                    ? `${selectedTags.length} tags selected`
                    : "Select tags"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            {/* Selected Tags Display within the component */}
            {/* {selectedTags.length > 0 && (
              <div className="mt-2 w-full">
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="flex items-center gap-1 text-xs"
                      onClick={(e) => e.preventDefault()}
                    >
                      {tag.name}
                      <button
                        type="button"
                        className="p-0 m-0 border-0 bg-transparent cursor-pointer"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          removeSelectedTag(tag);
                        }}
                        onClick={(e) => e.preventDefault()}
                      >
                        <X className="h-3 w-3 hover:text-red-500" />
                      </button>
                    </Badge>
                  ))}
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        clearAllTags();
                      }}
                      onClick={(e) => e.preventDefault()}
                      className="h-6 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 p-0" align="start" sideOffset={4}>
          {/* Selected Tags Display within the component */}
          {selectedTags.length > 0 && (
            <div className="mt-2 w-full">
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                    onClick={(e) => e.preventDefault()}
                  >
                    {tag.name}
                    <button
                      type="button"
                      className="p-0 m-0 border-0 bg-transparent cursor-pointer"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        removeSelectedTag(tag);
                      }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <X className="h-3 w-3 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      clearAllTags();
                    }}
                    onClick={(e) => e.preventDefault()}
                    className="h-6 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          )}
          {/* <DropdownMenuLabel>Select Tags</DropdownMenuLabel> */}
          <DropdownMenuSeparator />

          {/* Main Search Input */}
          <div className="relative p-3 pb-2">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DropdownMenuSeparator />

          {loading || isSearching ? (
            <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              {isSearching ? "Searching..." : "Loading tags..."}
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm
                ? "No tags found matching your search."
                : "No tags available."}
            </div>
          ) : (
            <DropdownMenuGroup>
              {filteredTags.map((group) => {
                const isFullySelected = isGroupFullySelected(group);
                const isPartiallySelected = isGroupPartiallySelected(group);
                const selectedCount = getGroupSelectedCount(group);

                return (
                  <DropdownMenuSub key={group.id}>
                    <DropdownMenuSubTrigger className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isFullySelected}
                          ref={(ref) => {
                            if (ref)
                              ref.indeterminate =
                                isPartiallySelected && !isFullySelected;
                          }}
                          onCheckedChange={(checked) =>
                            handleGroupSelect(group, checked)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {selectedCount}/{group.values.length}
                      </span>
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent className="p-0 w-64">
                      <Command>
                        <CommandInput
                          placeholder={`Search ${group.name.toLowerCase()}...`}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>
                            No tags found in this group.
                          </CommandEmpty>
                          <CommandGroup>
                            {group.values.map((tagValue) => {
                              const isSelected = selectedTags.some(
                                (tag) => tag.id === tagValue.id
                              );

                              return (
                                <CommandItem
                                  key={tagValue.id}
                                  value={tagValue.name}
                                  onSelect={() => {
                                    handleTagSelect(tagValue);
                                  }}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={() => {}} // Handled by parent onSelect
                                  />
                                  <span>{tagValue.name}</span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              })}
            </DropdownMenuGroup>
          )}

          {selectedTags.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clearAllTags}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All Selected Tags
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HierarchicalTagSelector;
// <div className="p-8 max-w-md mx-auto space-y-6">
//   <div>
//     <h2 className="text-xl font-bold mb-4">Hierarchical Tag Selector</h2>
//     <HierarchicalTagSelector
//       tags={sampleTags}
//       selectedTags={selectedTags}
//       onTagsChange={setSelectedTags}
//       searchTerm={searchTerm}
//       onSearchChange={setSearchTerm}
//       placeholder="Search tags..."
//     />
//   </div>

//   <div className="text-sm text-gray-600">
//     <p>Selected: {selectedTags.length} tags</p>
//     {selectedTags.length > 0 && (
//       <ul className="mt-2 space-y-1">
//         {selectedTags.map(tag => (
//           <li key={tag.id}>• {tag.name}</li>
//         ))}
//       </ul>
//     )}
//   </div>
// </div>
