"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import UserInfoStep from "./steps/UserInfoStep";
import AppIntentStep from "./steps/AppIntentStep";
import AppStylingStep from "./steps/AppStylingStep";
import FinishStep from "./steps/FinishStep";
import Stepper from "@/app/components/Stepper";
import { signup } from "@/DAL/signup";
import { toast } from "sonner";

const initialValues = {
  // First step
  name: "",
  email: "",
  phone: "",
  // Second step
  app_name: "",
  intent: "",
  domain: "",
  // Third step
  logo: "",
  theme_palette: "",
};

const getValidationSchema = (step) => {
  switch (step) {
    case 0:
      return Yup.object({
        name: Yup.string()
          .required("Full name is required")
          .max(30, "Full name must be at most 30 characters"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        phone: Yup.string().required("Phone number is required"),
      });
    case 1:
      return Yup.object({
        app_name: Yup.string()
          .required("App name is required")
          .max(25, "App name must be at most 25 characters"),
        intent: Yup.string().required("Intent is required"),
        domain: Yup.string()
          .required("Domain is required")
          .max(25, "Domain name must be at most 25 characters")
          .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Invalid domain format"),
      });
    case 2:
      return Yup.object({
        logo: Yup.string().required("Logo is required"),
        theme_palette: Yup.string().required("Theme palette is required"),
      });
    default:
      return Yup.object(); // No validation for final step
  }
};

const SignupSteps = () => {
  const [step, setStep] = useState(0);

  const handleNext = async (values, actions) => {
    // console.log("in handleNext", values, actions);
    const currentValidationSchema = getValidationSchema(step);
    try {
      await currentValidationSchema.validate(values, { abortEarly: false });
      if (step < 3) setStep(step + 1);
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
      actions.setErrors(errors);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (values) => {
    console.log("Form submitted:", values);
    const { app_name, domain, intent, logo, theme_palette } = values;
    const missingFields = [];
    if (!app_name) missingFields.push("App Name");
    if (!domain) missingFields.push("Domain");
    if (!intent) missingFields.push("Intent");
    if (!logo) missingFields.push("Logo");
    if (!theme_palette) missingFields.push("Theme Palette");

    if (missingFields.length > 0) {
      toast.error(`Missing required field(s): ${missingFields.join(", ")}`);
      return;
    }
    const payload = {
      logo: logo,
      app_color: theme_palette,
      name: app_name,
      store_type_id: intent,
      sub_domain: domain,
    };
    const response = await signup({ payload });
    console.log("signup response", response);
    const result = response?.data?.result;
    if (!result.code === 200) return;
    setStep(step + 1); // Go to Finish step
  };

  const steps = [
    <UserInfoStep onNext={handleNext} />,
    <AppIntentStep onNext={handleNext} onBack={handleBack} />,
    <AppStylingStep onBack={handleBack} />,
    <FinishStep />,
  ];

  return (
    <div className="flex flex-col align-center justify-center">
      <div className="mb-6">
        <Stepper step={step} />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema(step)}
        onSubmit={handleSubmit}
      >
        <Form>{steps[step]}</Form>
      </Formik>
    </div>
  );
};

export default SignupSteps;
