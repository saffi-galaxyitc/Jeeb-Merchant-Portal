"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/app/components/ui/button";

export function CategoryCombobox({
  categories,
  selectedCategory,
  setSelectedCategory,
  setSearchTerm,
  loading,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between border border-1 border-gray-700 text-gray-700 bg-gray-100"
        >
          {selectedCategory
            ? categories.find(
                (cat) => String(cat.id) === String(selectedCategory)
              )?.name
            : "Select category..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search category..."
            className="h-9"
            onValueChange={(val) => setSearchTerm(val)}
          />
          <CommandList>
            {loading && <div className="p-2 text-gray-500">Loading...</div>}
            {!loading && <CommandEmpty>No categories found.</CommandEmpty>}
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={String(cat.id)}
                  onSelect={(currentValue) => {
                    setSelectedCategory(
                      currentValue === selectedCategory ? null : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {cat.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      String(selectedCategory) === String(cat.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
