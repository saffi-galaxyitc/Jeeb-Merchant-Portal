import { redirect } from "next/navigation";
import "@splidejs/react-splide/css";

export default function Home() {
  redirect("/signin");
}
