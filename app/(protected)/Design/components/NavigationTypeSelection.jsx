"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function NavigationTypeSelection({
  navigation,
  itemNavigationUpdate,
  componentId,
  itemId,
}) {
  return (
    <div className="p-4">
      <strong className="text-sm text-gray-600">Select navigation type:</strong>{" "}
      <br />
      <RadioGroup
        value={navigation}
        onValueChange={(value) => {
          console.log("Updated selectedNavOption:", value);
          itemNavigationUpdate(componentId, value, itemId);
        }}
        className="flex-col gap-2"
      >
        <div className="flex items-center space-x-2 text-xs">
          <RadioGroupItem value="SubCategory" id="subcategory" />
          <Label htmlFor="subcategory" className="text-xs">
            Category Page
          </Label>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <RadioGroupItem value="AllProducts" id="allproducts" />
          <Label htmlFor="allproducts" className="text-xs">
            Product Page
          </Label>
        </div>
      </RadioGroup>
      <div className="mt-4 text-xs text-gray-600">
        <strong>Selected:</strong> {navigation} <br />
      </div>
    </div>
  );
}
