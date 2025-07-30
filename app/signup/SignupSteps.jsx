"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import UserInfoStep from "./steps/UserInfoStep";
import AppIntentStep from "./steps/AppIntentStep";
import AppStylingStep from "./steps/AppStylingStep";
import FinishStep from "./steps/FinishStep";
import Stepper from "@/app/components/Stepper";

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
  theme_palette: {
    primary: [],
    secondary: [],
  },
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
        theme_palette: Yup.object({
          primary: Yup.array()
            .of(Yup.number().min(0).max(255))
            .length(3)
            .required("Primary color is required"),
          secondary: Yup.array()
            .of(Yup.number().min(0).max(255))
            .length(3)
            .required("Secondary color is required"),
        }).required("Theme palette is required"),
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

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
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
