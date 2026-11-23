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
    rating: 4,
    review:
      "Lovely Sunday roast, but we waited 40 minutes for it.",
    draft:
      "Glad you enjoyed the roast. I’m sorry you had to wait 40 minutes.",
  },
  {
    label: "Complaint",
    rating: 1,
    review:
      "Staff were rude and made things worse. Nobody apologised.",
    draft:
      "I’m sorry about how our team spoke to you and that things got worse. You should have had an apology at the time. If you’d like to talk it through, please ask for the duty manager privately.",
  },
] as const;
