"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Validation schema for new password
const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const NewPasswordForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    console.log("New password values:", values);

    // Simulate API call
    setTimeout(() => {
      // Handle password reset logic here
      console.log("Password reset successful");
      router.push("/signin"); // Redirect to login after successful password reset
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex w-full justify-center">
      <div className="flex items-center w-full justify-center bg-white">
        <div className="w-full max-w-md rounded-lg shadow-[0px_4px_13.9px_0px_#00000040] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set a new password
            </h1>
            <p className="text-sm font-normal text-gray-400 mb-2">
              Your new password must be different from your previous password
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Formik
                initialValues={{
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, values }) => (
                  <Form className="space-y-6">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Field
                          as={Input}
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-12 px-8 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <p className="text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Field
                          as={Input}
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-12 px-8 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="text-sm text-gray-500">
                      Must be at least 8 characters
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !values.password ||
                        !values.confirmPassword
                      }
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>

                    {/* Back to Login Link */}
                    <div className="text-center pt-4">
                      <Link
                        href="/signin"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Back to login
                      </Link>
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

export default NewPasswordForm;
