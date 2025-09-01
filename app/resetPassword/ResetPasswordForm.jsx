"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getResetPasswprdOTP } from "@/DAL/resetPasword";
import { useReset } from "../mainContext/ResetContext";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPasswordForm = () => {
  const router = useRouter();
  const { setUserId, setUserEmail } = useReset();
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form values:", values);
    // Handle form submission here
    const { email } = values;
    const payload = {
      email,
    };
    const response = await getResetPasswprdOTP({ payload });
    console.log("result getResetPasswprdOTP", response);
    const result = response?.data?.result;
    if (result?.code === 200) {
      const id = result?.result?.user_id;
      console.log("first", id);
      setUserId(id);
      setUserEmail(email);
      setTimeout(() => {
        setSubmitting(false);
        router.push("/verifyEmail");
      }, 400);
    }
  };

  return (
    <div className="min-h-screen flex w-full justify-center">
      <div className=" flex items-center w-full justify-center bg-white">
        <div className="w-full max-w-md rounded-lg shadow-[0px_4px_13.9px_0px_#00000040] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot your Password?
            </h1>
            <p className="text-sm font-normal text-gray-400 mb-2">
              We will send you a code to reset your password.
            </p>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
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

                    <Button
                      type="submit"
                      // onClick={() =>
                      //   handleSubmit(values, { setSubmitting: () => {} })
                      // }
                      disabled={isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {isSubmitting ? "Sending code..." : "Reset password"}
                    </Button>

                    {/* Sign Up Link */}
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

export default ResetPasswordForm;
