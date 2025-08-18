"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PageCombobox({
  value,
  onChange,
  availablePages,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const selectedPage = availablePages.find((p) => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
        >
          {selectedPage ? selectedPage.name : "Select a page..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search page..." className="h-9" />
          <CommandList>
            <CommandEmpty>No page found.</CommandEmpty>
            <CommandGroup>
              {availablePages.map((page) => (
                <CommandItem
                  key={page.id}
                  value={page.name}
                  onSelect={(currentValue) => {
                    onChange(page.id);
                    setOpen(false);
                  }}
                >
                  {page.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === page.id ? "opacity-100" : "opacity-0"
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
