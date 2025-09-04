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

export function ProductCombobox({
  products,
  selectedProduct,
  setSelectedProduct,
  setSearchTerm,
  loading,
}) {
  const [open, setOpen] = useState(false);
  console.log("products", products);
  // find currently selected product
  const selected = products.find(
    (p) => String(p.id) === String(selectedProduct)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border border-1 border-gray-700 text-gray-700 bg-gray-100"
        >
          {selected ? selected.name : "Select product..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search product..."
            className="h-9"
            onValueChange={(val) => setSearchTerm(val)}
          />
          <CommandList>
            {loading && <div className="p-2 text-gray-500">Loading...</div>}
            {!loading && products.length === 0 && (
              <CommandEmpty>No products found.</CommandEmpty>
            )}
            <CommandGroup>
              {products.map((p) => (
                <CommandItem
                  key={p.id}
                  value={String(p.id)}
                  onSelect={(currentValue) => {
                    setSelectedProduct(
                      currentValue === selectedProduct ? null : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {p.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      String(selectedProduct) === String(p.id)
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
