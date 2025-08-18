import { useFormikContext } from "formik";
import Select from "react-select";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";

const SearchableIntentSelect = ({ name, options, onSearch, onFocus }) => {
  const { setFieldValue, values } = useFormikContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (selectedOption) => {
    setFieldValue(name, selectedOption ? selectedOption.value : "");
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (inputValue) => {
      setIsLoading(true);
      await onSearch(inputValue);
      setIsLoading(false);
    }, 400),
    [onSearch]
  );

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      debouncedSearch(inputValue);
    }
    return inputValue;
  };

  const handleFocus = () => {
    if (onFocus) {
      setIsLoading(true);
      onFocus().finally(() => setIsLoading(false));
    }
  };

  return (
    <Select
      value={options.find((option) => option.value === values[name]) || null}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onMenuOpen={handleFocus} // Fetch initial list when opened
      options={options}
      isClearable
      isLoading={isLoading}
      placeholder="Select an intent..."
      noOptionsMessage={() => "No intents found"}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "#fff",
          borderColor: state.isFocused
            ? "oklch(54.6% .245 262.881)"
            : "#d1d5db", // Tailwind blue-600
          boxShadow: state.isFocused
            ? "0 0 0 calc(2px + var(--tw-ring-offset-width)) oklch(54.6% .245 262.881)"
            : "none", // mimic focus:ring-2
          "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
          "--tw-ring-offset-width": "0.0000001rem",
          "--tw-ring-color": "oklch(54.6% .245 262.881)",
          borderRadius: "0.5rem", // rounded-lg
          padding: "0.25rem 0.5rem",
          marginBottom: "0.5rem",
          minHeight: "3.5rem",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af",
        }),
        input: (base) => ({
          ...base,
          color: "#111827",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#111827",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: "#6b7280",
          "&:hover": {
            color: "oklch(54.6% .245 262.881)",
          },
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          marginTop: "0.25rem",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#eff6ff" : "#fff",
          color: "#111827",
          "&:active": {
            backgroundColor: "#dbeafe",
          },
        }),
      }}
    />
  );
};

export default SearchableIntentSelect;
