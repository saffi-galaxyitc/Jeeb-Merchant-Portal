import Image from "next/image";

export default function SignInImage() {
  return (
    <div className="hidden md:block w-1/2 h-screen relative">
      <Image
        src="/Images/signInImage.svg"
        alt="SignIn illustration"
        fill
        className="object-fit"
        priority
      />
    </div>
  );
}
