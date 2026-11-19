export const scenarios = [
  {
    label: "Praise",
    rating: 5,
    review: "Lovely Sunday roast. The team made us feel right at home.",
    draft:
      "Thanks for joining us for Sunday lunch. We’re glad you loved the roast and that the team made you feel right at home. We’d love to see you again.",
  },
  {
    label: "Mixed feedback",
    rating: 3,
    review:
      "Great atmosphere and friendly service. We liked the food, but waited nearly an hour for it.",
    draft:
      "We’re glad you enjoyed the food and the atmosphere, and we’re sorry you waited so long. Thanks for telling us. If you’d like to share more about your visit, please get in touch with the venue directly.",
  },
  {
    label: "Complaint",
    rating: 1,
    review:
      "We booked for a birthday but our table wasn’t ready. Nobody could tell us how long the wait would be.",
    draft:
      "We’re sorry your birthday visit started with a wait and that we couldn’t give you a clear update. Please get in touch with the venue directly if you’re happy to talk about what happened.",
  },
] as const;
