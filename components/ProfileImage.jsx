import Image from "next/image";

export default function ProfileImage() {
  return (
    <Image
      src="/Images/profile.svg"
      alt="Profile image"
      width={48}
      height={48}
      className="rounded-full object-cover"
      priority
    />
  );
}
