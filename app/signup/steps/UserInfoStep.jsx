"use client";

import { useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { email_check, verify_otp, verify_send } from "@/DAL/signup";

const UserInfoStep = ({ onNext }) => {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [maskedEmail, setMaskedEmail] = useState("");
  const {
    values,
    validateForm,
    setTouched,
    setFieldValue,
    setFieldTouched,
    setErrors,
  } = useFormikContext();

  const maskEmail = async (email) => {
    if (!email) return "";

    const [localPart, domain] = email.split("@");

    if (localPart.length <= 1) {
      return "*@" + domain;
    }

    const visibleChar = localPart[0];
    const masked = "*".repeat(localPart.length - 1);
    const maskedEmailFull = `${visibleChar}${masked}@${domain}`;
    setMaskedEmail(maskedEmailFull);
  };

  const handleVerify = async (values, actions) => {
    // Validate the current Formik step first
    const errors = await actions.validateForm();

    // Mark all current step fields as touched to show errors in the UI
    actions.setTouched({
      name: true,
      email: true,
      phone: true,
    });

    // If there are errors, stop here
    if (errors.name || errors.email || errors.phone) {
      return;
    }
    await maskEmail(values.email);
    const payload = {
      name: values.name,
      email: values.email,
      mobile: values.phone,
    };
    console.log("payload", payload);
    try {
      const response = await verify_send({ payload });
      console.log("handle verify resp:", response);
      const result = response?.data?.result;
      if (result?.code !== 200) return;

      const userId = result?.result?.user_id;
      if (!userId) {
        console.error("User ID not found in response:", result);
        return;
      }

      setUserId(userId);
      setOpen(true);
    } catch (err) {
      console.error("Send verification code failed:", err);
    }
  };

  const handleOTPSubmit = async (values, actions) => {
    try {
      const payload = { user_id: userId, otp };
      const response = await verify_otp({ payload });
      console.log("response of verify otp", response);

      const result = response?.data?.result;

      if (result?.code === 200) {
        console.log("first");
        setOpen(false);
        onNext(values, actions); // move to next step
      } else {
        toast.error("Unable to verify your email!", {
          description:
            result?.message ||
            "Invalid OTP. Please check your email and try again.",
        });
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      toast.error("Something went wrong!", {
        description: "Please try again later.",
      });
    }
  };

  const handlePaste = async (e) => {
    const pasted = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted);
      e.preventDefault(); // Prevent default paste to avoid double input
    }
  };

  const handleVerifyEmail = async (e) => {
    try {
      const email = e?.target?.value || "";
      if (!email) return;
      const response = await email_check({ payload: { email } });
      const result = response?.data?.result;
      if (result?.result?.exists) {
        // If email exists, set Formik field error
        setFieldError("email", "Email already exists. Please use another.");
      }
    } catch (err) {
      console.error("Email verification failed:", err);
    }
  };

  return (
    <>
      <div className="max-w-md w-full bg-white p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          User Info & Verification
        </h2>

        <Field
          name="name"
          placeholder="Full Name"
          className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <ErrorMessage
          name="name"
          component="div"
          className="text-red-500 text-sm mb-2"
        />

        <Field
          name="email"
          type="email"
          placeholder="Email"
          className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          onBlur={handleVerifyEmail}
        />
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-500 text-sm mb-2"
        />

        <PhoneInput
          country={"om"}
          onChange={(value) => {
            setFieldValue("phone", value);
          }}
          onBlur={() => {
            setFieldTouched("phone", true);
          }}
          value={values?.phone}
          containerClass="my-2"
          buttonStyle={{
            borderTopLeftRadius: "0.625rem",
            borderBottomLeftRadius: "0.625rem",
            backgroundColor: "transparent",
            paddingRight: 5,
          }}
          inputClass="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          inputStyle={{
            paddingLeft: 50,
            height: 56,
            width: "100%",
            borderRadius: "0.625rem",
          }}
        />
        <ErrorMessage
          name="phone"
          component="div"
          className="text-red-500 text-sm mb-2"
        />

        <Field>
          {({ form }) => (
            <Button
              type="button"
              onClick={() => handleVerify(values, { validateForm, setTouched })}
              className="h-56 w-full  mt-4 theme-bg-blue text-xl font-bold"
            >
              Send verify code
            </Button>
          )}
        </Field>
      </div>

      {/* OTP Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {`Enter the OTP you just received on your email ending with ${maskedEmail}`}
            </DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col gap-4 items-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onPaste={handlePaste}
              className="flex justify-center"
            >
              <InputOTPGroup className="gap-4">
                {[...Array(6)].map((_, idx) => (
                  <InputOTPSlot
                    key={idx}
                    index={idx}
                    className="h-56 w-full my-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Field>
              {({ form }) => (
                <Button
                  onClick={() => handleOTPSubmit(values, { setErrors })}
                  className="w-full h-56 rounded-lg theme-bg-blue text-xl font-bold"
                >
                  Verify
                </Button>
              )}
            </Field>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserInfoStep;
