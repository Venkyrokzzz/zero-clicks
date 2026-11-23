import { FIVE_STAR_REPLY } from "@/lib/reviewDraftDefaults";

export const scenarios = [
  {
    label: "Praise",
    rating: 5,
    review: "Lovely Sunday roast. The team made us feel right at home.",
    draft: FIVE_STAR_REPLY,
  },
  {
    label: "Mixed feedback",
    rating: 3,
    review:
      "Great atmosphere and friendly service. We liked the food, but waited nearly an hour for it.",
    draft:
      "I’m glad you liked the food, but an hour is too long to wait. I’m sorry we kept you.",
  },
  {
    label: "Complaint",
    rating: 1,
    review:
      "Staff were rude and made things worse. Nobody apologised.",
    draft:
      "I’m sorry about how our team spoke to you and that we made things worse. You should have had an apology at the time. If you’d like to talk it through, please ask for the duty manager.",
  },
] as const;
