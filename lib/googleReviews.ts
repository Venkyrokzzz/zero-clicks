const RATINGS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
export function googleRating(value: string): number | undefined { return RATINGS[value]; }
export function googleReviewsUrl(account: string, location: string): string {
  const accountId = account.replace(/^accounts\//, '');
  const locationId = location.split('/').pop();
  if (!accountId || !locationId) throw new Error('Missing Google location');
  return `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`;
}
export function googleReplyUrl(account: string, location: string, review: string): string {
  const reviewId = review.split('/').pop();
  if (!reviewId) throw new Error('Missing Google review');
  return `${googleReviewsUrl(account, location)}/${encodeURIComponent(reviewId)}/reply`;
}

export function googleVenueResource(account: string, location: string): string | null {
  const accountId = account.replace(/^accounts\//, '');
  const locationId = location.split('/').pop();
  if (![accountId, locationId].every(id => id && /^[\w-]+$/.test(id))) return null;
  return `accounts/${accountId}/locations/${locationId}`;
}

export function googleReviewResource(account: string, location: string, review: string): string | null {
  const venue = googleVenueResource(account, location);
  const reviewId = review.split('/').pop();
  if (!venue || !reviewId || !/^[\w-]+$/.test(reviewId)) return null;
  const resource = `${venue}/reviews/${reviewId}`;
  return !review.includes('/') || review === resource ? resource : null;
}

export function googleReplyState(value: unknown): 'pending' | 'approved' | 'rejected' | 'unknown' {
  if (value === 'PENDING') return 'pending';
  if (value === 'APPROVED') return 'approved';
  if (value === 'REJECTED') return 'rejected';
  return 'unknown';
}
