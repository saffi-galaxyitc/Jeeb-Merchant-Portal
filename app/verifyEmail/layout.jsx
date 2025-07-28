import SignInImage from "@/components/SigninImage";
import VerifyEmailForm from "./verifyEmailForm";

export default function verifyEmailLayout() {
  return (
    <div className="min-h-screen flex items-center">
      <SignInImage />
      <div className="w-full md:w-1/2 p-6 flex justify-center flex-col">
        <div className="flex-grow-1 flex items-start justify-center mt-10">
          <VerifyEmailForm />
        </div>
      </div>
    </div>
  );
}
