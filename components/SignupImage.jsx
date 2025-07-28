import Image from "next/image";

export default function SignupImage() {
  return (
    <div className="hidden md:block w-1/2 h-screen relative">
      <Image
        src="/Images/signupImage.svg"
        alt="Signup illustration"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
