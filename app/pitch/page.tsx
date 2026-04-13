import PitchDeck from "@/components/PitchDeck";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reputation Manager — Zero Clicks",
  description:
    "AI handles your Google reviews. You approve in one click. Free trial, then £55/month.",
};

export default function PitchPage() {
  return <PitchDeck />;
}
