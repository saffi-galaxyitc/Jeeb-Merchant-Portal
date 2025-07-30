import { useField } from "formik";

const DomainInputField = (props) => {
  const [field, , helpers] = useField(props.name);

  const handleChange = (e) => {
    let value = e.target.value;

    // Only allow lowercase letters, numbers, and hyphens (basic domain name)
    value = value.toLowerCase().replace(/[^a-z0-9-]/g, "");

    // Prevent starting or ending with hyphen
    value = value.replace(/^-+|-+$/g, "");

    helpers.setValue(value);
  };

  return (
    <div className="flex">
      <input
        {...field}
        {...props}
        onChange={handleChange}
        className="h-56 w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm rounded-none"
      />
      <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 text-gray-500 text-sm">
        .galaxysolutions.com
      </span>
    </div>
  );
};

export default DomainInputField;
