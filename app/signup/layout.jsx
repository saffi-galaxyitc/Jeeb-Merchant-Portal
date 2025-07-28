import SignupImage from "@/components/SignupImage";
import SignupSteps from "./SignupSteps";

export default function SignupLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 p-6 flex justify-center flex-col">
        <div className="flex-grow-0 flex items-start justify-center mt-10">
          <SignupSteps />
        </div>
      </div>

      <SignupImage />
    </div>
  );
}
