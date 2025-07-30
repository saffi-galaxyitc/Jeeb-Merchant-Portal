"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";

// Validation schema for OTP
const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{5}$/, "OTP must be exactly 5 digits")
    .required("OTP is required"),
});

const VerifyEmailForm = () => {
  const router = useRouter();

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    console.log("OTP values:", values);

    // Simulate API call
    setTimeout(() => {
      // You can add validation here
      if (values.otp === "12345") {
        // Example validation
        router.push("/newPassword");
      } else {
        setErrors({ otp: "Invalid OTP code" });
      }
      setSubmitting(false);
    }, 400);
  };

  const handlePaste = (e, setFieldValue) => {
    const pasted = e.clipboardData.getData("Text").trim();
    if (/^\d{5}$/.test(pasted)) {
      setFieldValue("otp", pasted);
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen flex w-full justify-center">
      <div className="flex items-center w-full justify-center bg-white">
        <div className="w-full max-w-md rounded-lg shadow-[0px_4px_13.9px_0px_#00000040] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-sm font-normal text-gray-400 mb-2">
              Enter/paste the code that have been sent to your......@gmail.com
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Formik
                initialValues={{
                  otp: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="w-full flex flex-col gap-4 items-center">
                      {/* OTP Input Field */}
                      <Field name="otp">
                        {({ field }) => (
                          <InputOTP
                            {...field}
                            maxLength={5}
                            value={values.otp}
                            onChange={(value) => setFieldValue("otp", value)}
                            onPaste={(e) => handlePaste(e, setFieldValue)}
                            className="flex justify-center"
                          >
                            <InputOTPGroup className="gap-4">
                              {[...Array(5)].map((_, idx) => (
                                <InputOTPSlot
                                  key={idx}
                                  index={idx}
                                  className="h-12 w-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        )}
                      </Field>

                      {/* Error Display */}
                      {errors.otp && touched.otp && (
                        <p className="text-sm text-red-500 text-center">
                          {errors.otp}
                        </p>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting || !values.otp}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                      >
                        {isSubmitting ? "Verifying..." : "Verify Code"}
                      </Button>
                    </div>

                    {/* Back to Login Link */}
                    <div className="text-center pt-4">
                      <span className="text-sm text-gray-600">
                        <Link
                          href="/signin"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Back to login
                        </Link>
                      </span>
                    </div>

                    {/* Resend Code Option */}
                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                        onClick={() => {
                          // Handle resend logic here
                          console.log("Resending code...");
                        }}
                      >
                        Didn't receive the code? Resend
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
