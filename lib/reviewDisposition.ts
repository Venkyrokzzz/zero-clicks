export const SERIOUS = new RegExp(
  [
    /allerg|anaphyla|coeliac|celiac|intoleran|epi.?pen/.source,
    /poison|food\s*safety|food\s*hygiene|environmental health|\bEHO\b|\bFSA\b|made me sick|got sick|fell ill|threw up|vomit|diarrh(?:oe|e)a|salmonella|norovirus|e\.?\s*coli/.source,
    /\b(?:glass|plastic|metal|staple|wire|screw|nail|hair|plaster|band.?aid)\s+(?:shattered\s+|broken\s+|baked\s+)?(?:in|inside|into)\b/.source,
    /\bfound\s+(?:a\s+|an\s+)?(?:[\w]+\s+){0,2}(?:glass|plastic|metal|staple|hair|plaster|maggot|cockroach|mouse|rat|droppings)\b/.source,
    /\b(?:mouse|mice|rat|rats|cockroach\w*|maggot\w*|vermin|rodent\w*|mouldy?|moldy?|rotten|spoiled|sour\s+(?:milk|cream)|out of date|expired)\b/.source,
    /\b(?:raw|undercooked)\s+(?:chicken|poultry|pork|burger|mince|sausage|fish|mussels|oysters|seafood)\b/.source,
    /\b(?:chicken|poultry|pork|burger|mince|sausage|fish|mussels|oysters|seafood)\s+(?:was|were|came out)\s+(?:raw|undercooked)\b/.source,
    /cross.?contaminat/.source,
    /injur|ambulance|paramedic|\bA\s*&\s*E\b|hospital|choked|scald(?:ed|ing)|blister|slipped|tripped|fainted|broken chair|fell (?:down|off|over)/.source,
    /unsafe|assault|threat|spik(?:e[ds]?|ing)|shoved|punched|grabbed\s+(?:my|our|his|her)|brawl/.source,
    /\b(?:1[0-7]|underage|under age|without checking id)\b[^.!?]{0,40}\b(?:alcohol|drink|pint|vodka|beer|wine|served)\b|\bserved\s+(?:my\s+)?1[0-7][- ]year[- ]old\b/.source,
    /discrimin|racis|homophob|transphob|sexis|ableis|\bslurs?\b/.source,
    /\brefused entry\b[^.!?]{0,50}\b(?:wheelchair|ramp|disabled|guide dog|turban|hijab|race|religion)\b|\bwheelchair\b[^.!?]{0,40}\b(?:refused|blocked|couldn['’]t get in)\b/.source,
  ].join('|'),
  'i'
)

export const STAFF = new RegExp(
  [
    /\brude\b|\bdismissive\b|\bdisrespectful\b|\bpatronis\w*\b|\barrogant\b|\bhostile\b|\baggressive\b|\bnasty\b|\bcheeky\b|\bhumiliat\w*\b|\bbelittl\w*\b/.source,
    /rolled (?:her|his|their) eyes|\b(?:snapped|shouted|yelled|screamed|barked|swore|cursed)\b/.source,
    /\b(?:staff|team|barman|bartender|waiter|waitress|server|barista|manager|landlord|doorman|bouncer|supervisor)\b[^.!?]{0,30}\b(?:ignored|shouted|yelled|laugh\w*|refused to listen|walked (?:off|away)|kicked us out|spoke down|unhelpful)\b/.source,
    /\bmade\b[^.!?]{0,35}\bworse\b/.source,
  ].join('|'),
  'i'
)

export const NO_APOLOGY = /\b(?:nobody|no one)\s+(?:ever\s+)?(?:app?olog\w*|said sorry)\b|\b(?:no|never|without|zero)\s+(?:an?\s+)?app?olog\w*\b|\b(?:didn['’]?t|never)(?:\s+even)?\s+(?:app?olog\w*|say sorry|said sorry)\b|\boffered\s+(?:no|zero)\s+app?olog\w*\b/i
export const WAIT = /\b(?:waited|waiting|long wait|slow service|took (?:ages|\d+ minutes|a (?:little )?while))\b/i
export const BILL = /\b(?:charged|billed)\s+(?:me\s+|us\s+)?twice\b|\b(?:double[- ]charg|duplicate\s+charge|overcharg)\w*|\bcheck your bill\b|\bpre-?authori[sz]ation\b|\bhidden\s+[^.!?]{0,20}charge\b|\brip[- ]?off\b/i
export const COLD_FOOD = /\b(?:food|mains?|starters?|dinner|meal|roast|sides?|steak|chips)\b[^.!?]{0,25}\b(?:went|was|were|arrived|came out)\s+(?:cold|lukewarm)\b|\b(?:cold|lukewarm)\s+(?:food|mains?|starters?|dinner|meal|roast|soup)\b/i
const AMBIGUOUS_PRAISE = /\b(?:sarcasm|not good|not great|not helpful|could have|should have|never coming|yeah right|thanks for nothing)\b/i
const COMPLAINT_MARKERS = /allerg|injur|sick(?!\s+(?:tunes|vibe|night|beats))|poison|discrimin|racis|unsafe|harass|cold(?!\s+(?:beer|pint|drink|lager|cider|rain|wind|outside))|slow|rude|wrong order|\bwait(?:ed|ing)?\b|queue|nois|filthy|overcharg|charged twice|ignored|locked|overpriced|pricey|refund|complaint|disgusting|never again|awful|terrible|horrible|worst|dirty|unacceptable|soggy|lukewarm|tight|awkward|limited|shrunk|average|nothing special|ran out/i
export const DRINKS_DELAY = /\bdrinks?\b[^.!?]{0,45}\b(?:after (?:the |our )?(?:food|mains)|took (?:ages|a (?:little )?while)|arrived late)\b/i
export const BOOKING = /\b(?:lost|couldn['’]t find|no record of) (?:our |my |the )?(?:booking|reservation)\b|\b(?:booked|reserved) (?:a |our )?table\b[^.!?]{0,42}\b(?:wasn['’]t ready|no table|unavailable|kitchen door)\b/i
export const WRONG_ORDER = /\b(?:wrong (?:order|meal|dish)|(?:brought|served) (?:me |us )?(?:someone else['’]s|the wrong))\b/i
export const ALLERGEN_QUESTION = /\b(?:couldn['’]t|could not|nobody|no one|staff|server|waiter|waitress|weren['’]t|wasn['’]t)\b[^.!?]{0,45}\b(?:tell|say|confirm|sure|know|guessed?)\b[^.!?]{0,70}\b(?:dairy|gluten|nuts?|peanuts?|allergen\w*|coeliac|celiac|shellfish|sesame|eggs?|milk|soya?)\b|\b(?:dairy|gluten|nuts?|peanuts?|allergen\w*|coeliac|celiac)\b[^.!?]{0,55}\b(?:nobody|no one|not|never|un)\w*\s*(?:seemed\s+)?(?:sure|knew|know|confirm|check)\b/i
export const PROMPT_INJECTION = /\b(?:ignore (?:all |your )?(?:previous |prior )?(?:instructions|rules)|system prompt|reveal (?:your |the )?prompt|debug mode|repeat after me|say [^.!?]{1,50} verbatim)\b/i

const LEGAL_OR_FINANCIAL_RISK = /\b(?:refund|fraud\w*|stolen|theft|nicked|scam|legal action|lawsuit|solicitor|lawyer|small claims|court|trading standards|gdpr|data deletion|cctv|privacy|chargeback|disputing|police|101|crime ref|local paper|press|viral|tiktok)\b|\b(?:comp|voucher|discount)\b[^.!?]{0,35}\b(?:or|review|tiktok|viral)\b/i
const SARCASM_OR_MISMATCH = /\b(?:yeah right|thanks for nothing|0 stars|zero stars|meant 1 star|by mistake|avoid this place|save your money|waste of money|shambles|disgrace|never coming back)\b|\b(?:five stars|top marks|brilliant|lovely)\s+if you (?:love|enjoy|fancy|like)\b|\bthrow\b[^.!?]{0,20}\bdown the drain\b|\bworst\s+(?:pub|restaurant|place|roast|food|experience)\b/i
const FOREIGN_REVIEW = /\b(?:muy|comida|servicio|lento|très|mauvais|accueil|froids?|schlecht|fantastisches|essen|bier|cibo|freddo|personale|cortese|świetne|jedzenie|obsługa)\b|[àâäçèêëîïôöùûüÿñáíóúłńśźż]/i

function cleanPraiseNegations(review: string): string {
  return review
    .replace(/\b(?:can['’]t|cannot) wait to (?:come|be|get|go) back\b/gi, '')
    .replace(/\bnot only\b([^.!?]{0,60})\bbut\b/gi, '$1')
    .replace(/\b(?:nothing but)\b/gi, '')
    .replace(/\b(?:zero|no|not (?:a )?single|without any)\s+(?:complaints?|issues?|problems?|faults?|waits?)\b/gi, '')
    .replace(/\b(?:not|never)\s+(?:a\s+|one\s+|too\s+)?(?:rude|slow|bad|cold|noisy|overpriced|dirty)\b/gi, '')
    .replace(/\b(?:ice|freezing)\s+cold\b|\bfrom the cold\b|\bcold\s+(?:from the|rain|wind|outside)\b/gi, '')
    .replace(/\b(?:queued?|waited)\s+(?:for\s+)?[1-5]\s+mins?(?:utes?)?\b[^.!?]{0,35}\bworth\b/gi, '')
    .replace(/\b(?:sick)\s+(?:tunes|vibe|night|beats)\b/gi, '')
}

function isCrypticNegative(rating: number, review: string): boolean {
  const trimmed = review.trim()
  if (!trimmed || rating > 2) return false
  if (/👎/.test(trimmed)) return true
  const words = trimmed.replace(/[^a-z0-9\s]/gi, ' ').trim().split(/\s+/).filter(Boolean)
  return words.length <= 2
}

export function hasReviewComplaint(review: string) {
  const feedback = cleanPraiseNegations(review)
  return (
    DRINKS_DELAY.test(review) ||
    BOOKING.test(review) ||
    WRONG_ORDER.test(review) ||
    ALLERGEN_QUESTION.test(review) ||
    AMBIGUOUS_PRAISE.test(review) ||
    SERIOUS.test(review) ||
    STAFF.test(review) ||
    NO_APOLOGY.test(review) ||
    WAIT.test(feedback) ||
    BILL.test(review) ||
    COLD_FOOD.test(review) ||
    SARCASM_OR_MISMATCH.test(review) ||
    COMPLAINT_MARKERS.test(feedback) ||
    /\b(?:but|however|although|except|though|pity|unfortunately)\b/i.test(feedback)
  )
}

export type ReviewDisposition = 'routine_praise' | 'routine_reply' | 'approval' | 'manager'

export function isRoutineReview(disposition: ReviewDisposition) {
  return disposition === 'routine_praise' || disposition === 'routine_reply'
}

export function classifyReview(rating: number, review: string): { disposition: ReviewDisposition; reason: string } {
  if (SERIOUS.test(review) || ALLERGEN_QUESTION.test(review)) {
    return { disposition: 'manager', reason: 'The guest raised a safety or welfare concern.' }
  }
  if (STAFF.test(review) || NO_APOLOGY.test(review)) {
    return { disposition: 'manager', reason: 'Check how the team handled the guest’s visit.' }
  }
  if (PROMPT_INJECTION.test(review)) {
    return { disposition: 'approval', reason: 'The review contains prompt-style instructions and needs owner review.' }
  }
  if (BILL.test(review) || LEGAL_OR_FINANCIAL_RISK.test(review)) {
    return { disposition: 'approval', reason: 'The guest raised a sensitive incident or payment issue.' }
  }
  if (SARCASM_OR_MISMATCH.test(review)) {
    return { disposition: 'approval', reason: 'The tone or star rating looks inconsistent and needs owner review.' }
  }
  if (FOREIGN_REVIEW.test(review)) {
    return { disposition: 'approval', reason: 'Non-English feedback should be reviewed before replying.' }
  }
  if (isCrypticNegative(rating, review)) {
    return { disposition: 'approval', reason: 'Low-rating feedback with very little context needs owner review.' }
  }
  if (rating === 5 && !hasReviewComplaint(review)) {
    return { disposition: 'routine_praise', reason: 'Straightforward five-star feedback.' }
  }
  return {
    disposition: 'routine_reply',
    reason: review.trim() ? 'Routine feedback with a tailored reply.' : 'Rating only. Uses the default reply for this rating.',
  }
}
