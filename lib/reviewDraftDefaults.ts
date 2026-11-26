export const FIVE_STAR_REPLY = "Thanks for the five stars! We’re glad you stopped by and hope to see you again soon.";

const ratingReplies: Record<number, string> = {
  1: "I’m sorry we let you down. If you’re willing to share what happened, please get in touch with the venue so we can listen.",
  2: "Thanks for leaving a rating. I’m sorry your visit fell short. We’d welcome the chance to hear what could have been better.",
  3: "Thanks for visiting and leaving a rating. If there’s something we could improve for next time, we’d be glad to hear it.",
  4: "Thanks for the four stars. We’re glad you stopped by and hope to see you again soon.",
  5: FIVE_STAR_REPLY,
};

export function ratingOnlyReply(rating: number) {
  return ratingReplies[rating] ?? ratingReplies[3];
}
