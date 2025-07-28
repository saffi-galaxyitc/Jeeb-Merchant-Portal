"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignInForm = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    // Handle form submission here
    setTimeout(() => {
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex w-full justify-center">
      <div className=" flex items-center w-full justify-center bg-white">
        <div className="w-full max-w-md rounded-lg shadow-[0px_4px_13.9px_0px_#00000040] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log in</h1>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  rememberMe: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                  <div className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        placeholder="Your email"
                        className="h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.email && touched.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Field
                        as={Input}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.password && touched.password && (
                        <p className="text-sm text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={values.rememberMe}
                          onCheckedChange={(checked) =>
                            setFieldValue("rememberMe", checked)
                          }
                          className="h-4 w-4"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                      <Link
                        href="/resetPassword"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password
                      </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                      type="button"
                      onClick={() =>
                        handleSubmit(values, { setSubmitting: () => {} })
                      }
                      disabled={isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {isSubmitting ? "Logging in..." : "Log in"}
                    </Button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4">
                      <span className="text-sm text-gray-600">
                        Don't have account?{" "}
                        <Link
                          href="/signup"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          sign up
                        </Link>
                      </span>
                    </div>
                  </div>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
