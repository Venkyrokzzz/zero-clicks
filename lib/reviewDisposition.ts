export const SERIOUS = /allerg|anaphyla|poison|food\s*safety|made me sick|got sick|fell ill|injur|discrimin|racis|harass|unsafe|assault|threat|spik(?:e[ds]?|ing)|hospital|glass in|\b(?:raw|undercooked)\s+(?:chicken|poultry|pork|burger)\b|\b(?:chicken|poultry|pork|burger)\s+(?:was|were|came out)\s+(?:raw|undercooked)\b|cross.contaminat/i
export const STAFF = /\brude\b|\bdismissive\b|\bdisrespectful\b|\bpatronis\w*\b|staff\s+(?:ignored|shouted|laughed)|\bmade\b[^.!?]{0,35}\bworse\b/i
export const NO_APOLOGY = /\b(?:nobody|no one)\s+(?:ever\s+)?(?:app?olog\w*|said sorry)\b|\b(?:no|never|without)\s+(?:an?\s+)?app?olog\w*\b|\bdidn['’]?t\s+(?:app?olog\w*|say sorry)\b/i
export const WAIT = /\b(?:waited|waiting|long wait|slow service|took (?:ages|\d+ minutes))\b/i
export const BILL = /\b(?:charged|billed)\s+(?:me\s+|us\s+)?twice\b|\b(?:double.charg|duplicate\s+charge|overcharg)\w*/i
export const COLD_FOOD = /\b(?:food|mains?|starters?|dinner|meal|roast)\b[^.!?]{0,25}\b(?:went|was|were|arrived|came out)\s+cold\b|\bcold\s+(?:food|mains?|starters?|dinner|meal|roast)\b/i
const AMBIGUOUS_PRAISE = /\b(?:sarcasm|not good|not great|not helpful|could have|should have|never coming|yeah right|thanks for nothing)\b/i
const COMPLAINT_MARKERS = /allerg|injur|sick|poison|discrimin|racis|unsafe|harass|cold(?!\s+(?:beer|pint|drink|lager|cider))|slow|rude|wrong order|\bwait(?:ed|ing)?\b|queue|nois|filthy|overcharg|charged twice|ignored|locked|overpriced|refund|complaint|disgusting|never again|awful|terrible|horrible|worst|dirty|unacceptable/i
export const DRINKS_DELAY = /\bdrinks?\b[^.!?]{0,45}\b(?:after (?:the |our )?(?:food|mains)|took ages|arrived late)\b/i
export const BOOKING = /\b(?:lost|couldn['’]t find|no record of) (?:our |my |the )?(?:booking|reservation)\b|\b(?:booked|reserved) (?:a |our )?table\b[^.!?]{0,42}\b(?:wasn['’]t ready|no table|unavailable)\b/i
export const WRONG_ORDER = /\b(?:wrong (?:order|meal|dish)|(?:brought|served) (?:me |us )?(?:someone else['’]s|the wrong))\b/i
export const ALLERGEN_QUESTION = /\b(?:couldn['’]t|could not|nobody could|no one could) (?:tell|say|confirm)\b[^.!?]{0,70}\b(?:dairy|gluten|nuts?|allergens?)\b/i

export function hasReviewComplaint(review: string) {
  const feedback = review.replace(/\b(?:can['’]t|cannot) wait to (?:come|be|get|go) back\b/gi, '')
  return DRINKS_DELAY.test(review) || BOOKING.test(review) || WRONG_ORDER.test(review) || ALLERGEN_QUESTION.test(review) || AMBIGUOUS_PRAISE.test(review) || SERIOUS.test(review) || STAFF.test(review) || NO_APOLOGY.test(review) || WAIT.test(review) || BILL.test(review) || COLD_FOOD.test(review) || COMPLAINT_MARKERS.test(feedback)
    || /\b(?:but|however|although|except)\b/i.test(review.replace(/\bnothing but\b/gi, ''))
    || /\b(?:fr[ií]a|lento|mal|mauvais|schlecht)\b/i.test(review)
}

export type ReviewDisposition = 'routine_praise' | 'approval' | 'manager'

export function classifyReview(rating: number, review: string): { disposition: ReviewDisposition; reason: string } {
  if (SERIOUS.test(review) || ALLERGEN_QUESTION.test(review)) return { disposition: 'manager', reason: 'The guest raised a safety or welfare concern.' }
  if (STAFF.test(review) || NO_APOLOGY.test(review)) return { disposition: 'manager', reason: 'Check how the team handled the guest’s visit.' }
  if (BILL.test(review)) return { disposition: 'approval', reason: 'The guest raised a billing issue.' }
  if (DRINKS_DELAY.test(review)) return { disposition: 'approval', reason: 'The guest reported that their drinks arrived late.' }
  if (WAIT.test(review)) return { disposition: 'approval', reason: 'The guest reported a wait.' }
  if (COLD_FOOD.test(review)) return { disposition: 'approval', reason: 'The guest reported cold food.' }
  if (BOOKING.test(review)) return { disposition: 'approval', reason: 'The guest raised a booking issue.' }
  if (WRONG_ORDER.test(review)) return { disposition: 'approval', reason: 'The guest says they received the wrong order.' }
  if (hasReviewComplaint(review)) return { disposition: 'approval', reason: 'The wording needs a closer look.' }
  if (rating !== 5) return { disposition: 'approval', reason: 'Check that the reply addresses the guest’s feedback.' }
  return { disposition: 'routine_praise', reason: 'Five-star review with the default thank-you draft.' }
}
