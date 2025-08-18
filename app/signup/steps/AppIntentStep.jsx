"use client";

import DomainInputField from "@/app/components/DomainInputField";
import { Button } from "@/app/components/ui/button";
import { app_check, domain_check, store_types } from "@/DAL/signup";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import SearchableIntentSelect from "../utils/SearchableIntentSelect";

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
  const [intentList, setIntentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleDomainNameCheck = async (e) => {
    try {
      const domain = e?.target?.value || "";
      if (!domain) return;
      const response = await domain_check({ payload: { sub_domain: domain } });
      console.log("domain check resp:", response);
      const result = response?.data?.result;
      if (result?.result?.exists) {
        // If email exists, set Formik field error
        setFieldError(
          "domain",
          "Domain name is already taken. Please use another."
        );
      }
    } catch (err) {
      console.error("Domain name verification failed:", err);
    }
  };
  const handleAppNameCheck = async (e) => {
    try {
      const app_name = e?.target?.value || "";
      if (!app_name) return;
      const response = await app_check({ payload: { app_name } });
      console.log("app name check resp:", response);
      const result = response?.data?.result;
      if (result?.result?.exists) {
        // If email exists, set Formik field error
        setFieldError(
          "app_name",
          "App name is already taken. Please use another."
        );
      }
    } catch (err) {
      console.error("App name verification failed:", err);
    }
  };
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
  const getIntent = async (search = "") => {
    try {
      const payload = { name: search }; // search term
      const response = await store_types({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        const formattedOptions = (result?.result || []).map((item) => ({
          value: item.id, // select value
          label: item.name, // select label
        }));
        setIntentList(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching intents:", error);
    }
  };

  useEffect(() => {
    getIntent();
  }, []);
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        App Intent & Info
      </h2>
      <Field
        name="app_name"
        placeholder="App Name"
        className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        onBlur={handleAppNameCheck}
      />
      <ErrorMessage
        name="app_name"
        component="div"
        className="text-red-500 text-sm mb-2"
      />

      <SearchableIntentSelect
        name="intent"
        options={intentList}
        onSearch={(inputValue) => getIntent(inputValue)}
        onFocus={() => getIntent("")} // load default list when focused
      />

      <ErrorMessage
        name="intent"
        component="div"
        className="text-red-500 text-sm mb-2"
      />

      <DomainInputField
        name="domain"
        placeholder="App Domain"
        onBlur={handleDomainNameCheck}
      />
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
