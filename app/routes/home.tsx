import type { Route } from "./+types/home";
import HomePage from "../pages/HomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hotel Booking System" },
    { name: "description", content: "Hotel Booking System" },
  ];
}

export default function Home() {
  return <HomePage />;
}
