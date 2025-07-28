"use client";

import DomainInputField from "@/components/DomainInputField";
import { Button } from "@/components/ui/button";
import { Field, ErrorMessage, useFormikContext } from "formik";

const AppIntentStep = ({ onNext, onBack }) => {
  const {
    values,
    errors,
    validateForm,
    setTouched,
    setFieldValue,
    setFieldTouched,
    setErrors,
  } = useFormikContext();

  const handleNext = async (values, actions) => {
    // Validate the current Formik step first
    const errors = await actions.validateForm();

    // Mark all current step fields as touched to show errors in the UI
    actions.setTouched({
      app_name: true,
      intent: true,
      domain: true,
    });

    // If there are errors, stop here
    if (errors.app_name || errors.intent || errors.domain) {
      return;
    }
    onNext(values, actions.setTouched);
  };
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        App Intent & Info
      </h2>
      <Field
        name="app_name"
        placeholder="App Name"
        className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <ErrorMessage
        name="app_name"
        component="div"
        className="text-red-500 text-sm mb-2"
      />
      <Field
        as="select"
        name="intent"
        className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value="" disabled hidden>
          Select an intent
        </option>
        <option value="Books and stationery">Books and stationery</option>
        <option value="Fashion and accessories">Fashion and accessories</option>
        <option value="Electronics and gadgets">Electronics and gadgets</option>
        <option value="Home and living">Home and living</option>
        <option value="Health and wellness">Health and wellness</option>
        <option value="Other">Other</option>
      </Field>

      <ErrorMessage
        name="intent"
        component="div"
        className="text-red-500 text-sm mb-2"
      />

      {/* <div className="relative flex rounded-lg shadow-sm my-2">
        <Field
          name="domain"
          placeholder="App Domain"
          className="h-56 w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm rounded-none"
        />
        <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 text-gray-500 text-sm  focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm rounded-none">
          .galaxysolutions.com
        </span>
      </div> */}
      <DomainInputField name="domain" placeholder="App Domain" />
      <ErrorMessage
        name="domain"
        component="div"
        className="text-red-500 text-sm mb-2"
      />

      <div className="flex justify-between mt-4 gap-4">
        <div className="w-1/2">
          <Field>
            {({ form }) => (
              <Button
                type="button"
                className="btn h-56 w-full text-xl font-bold theme-bg-blue"
                onClick={onBack}
              >
                Back
              </Button>
            )}
          </Field>
        </div>
        <div className="w-1/2">
          <Field>
            {({ form }) => (
              <Button
                type="button"
                className="btn h-56 w-full text-xl font-bold theme-bg-blue"
                onClick={() =>
                  handleNext(values, { validateForm, setTouched, setErrors })
                }
              >
                Next
              </Button>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};

export default AppIntentStep;
