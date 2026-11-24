import { FIVE_STAR_REPLY } from "@/lib/reviewDraftDefaults";

export const reviewExamples = [
  {
    label: "Mixed feedback",
    leading: "Loved the ",
    praise: "atmosphere",
    middle: ", but ",
    concern: "service could be better",
    topics: ["Atmosphere", "Service"],
    rating: 5,
    draft: "Glad you enjoyed the atmosphere. I’m sorry the service didn’t quite match. Thanks for letting us know.",
  },
  {
    label: "Straight praise",
    leading: "Wonderful ",
    praise: "Sunday roast",
    middle: " and ",
    concern: "a lovely welcome",
    topics: ["Sunday roast", "Warm welcome"],
    rating: 5,
    draft: FIVE_STAR_REPLY,
  },
  {
    label: "Serious concern",
    leading: "The chair broke and I ",
    praise: "",
    middle: "",
    concern: "injured my back",
    topics: ["Guest injury", "Manager review"],
    rating: 5,
    draft: "I’m sorry about what you’ve described. Could you get in touch with the venue and ask for the duty manager so we can speak privately?",
  },
] as const;
