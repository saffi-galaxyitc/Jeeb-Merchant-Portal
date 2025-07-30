import SignInImage from "@/app/components/SigninImage";
import SignInForm from "./SignInForm";

export default function SignInLayout() {
  return (
    <div className="min-h-screen flex items-center">
      <SignInImage />
      <div className="w-full md:w-1/2 p-6 flex justify-center flex-col">
        <div className="flex-grow-1 flex items-start justify-center mt-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
