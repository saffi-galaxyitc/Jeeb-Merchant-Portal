"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import Link from "next/link";
import { authRequest, getToken, webLoginApi } from "@/DAL/signin";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useAuth } from "../mainContext/AuthContext";

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
  const [csrfToken, setCsrfToken] = useState(null);
  const { setSessionInfo, handleAuthentication } = useAuth();
  const router = useRouter();

  const callCSRFApi = async () => {
    try {
      const result = await getToken();
      if (result.success) {
        setCsrfToken(result.token);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  useEffect(() => {
    callCSRFApi();
  }, []);
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form values:", values);
    // handleAuthentication(true);
    // setCookie("authenticated", "true", {
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    // });

    // // Redirect to a protected route (or wherever you want)
    // router.push("/design");
    try {
      // if (Object.keys(errors).length > 0) {
      //   Object.values(errors).forEach((errMsg) => {
      //     toast.error(errMsg, { position: "top-right" });
      //   });
      //   setSubmitting(false);
      //   return;
      // }
      const { email, password } = values;
      await webLoginApi({ login: email, password, csrfToken });
      const result = await authRequest(email, password);
      console.log("authentication result", result);
      if (result.success) {
        // console.log("authentication result", result);
        setSessionInfo({
          company_id: result.company_id,
          user_id: result.user_id,
          context: result.context,
          name: result.name,
          username: result.username,
          user_companies: result.user_companies,
        });
        handleAuthentication(true);
        localStorage.setItem("authenticated", JSON.stringify(true));
        // Store in both localStorage and cookies
        setCookie("authenticated", "true", {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Redirect to a protected route (or wherever you want)
        router.push("/design"); // or "/products" or "/settings"
      } else {
        localStorage.setItem("authenticated", JSON.stringify(false));
        setCookie("authenticated", "false");
        toast.error("Wrong emaill or password.", {
          position: "top-right",
        });
      }
      // Handle form submission here
      setTimeout(() => {
        setSubmitting(false);
      }, 400);
      // ✅ continue normal API call if no errors
      console.log("Submitting to API...");
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
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
                {({
                  errors,
                  touched,
                  isSubmitting,
                  setSubmitting,
                  values,
                  setFieldValue,
                }) => (
                  <Form className="space-y-6">
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
                      type="submit"
                      // onClick={() =>
                      //   handleSubmit(values, errors, {
                      //     setSubmitting: () => {},
                      //   })
                      // }
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

export default SignInForm;
