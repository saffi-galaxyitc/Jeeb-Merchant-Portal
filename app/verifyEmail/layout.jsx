import SignInImage from "@/app/components/SigninImage";
import VerifyEmailForm from "./verifyEmailForm";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

export default function verifyEmailLayout() {
  // const router = useRouter();
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
  //   const id = router?.state?.userId;
  //   console.log("User ID:", id);
  //   setUserId(id);
  // }, [router]);

  return (
    <div className="min-h-screen flex items-center">
      <SignInImage />
      <div className="w-full md:w-1/2 p-6 flex justify-center flex-col">
        <div className="flex-grow-1 flex items-start justify-center mt-10">
          <VerifyEmailForm />
          {/* <VerifyEmailForm userId={userId} /> */}
        </div>
      </div>
    </div>
  );
}
