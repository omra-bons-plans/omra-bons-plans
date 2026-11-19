/** Returns the URL path for an ad, using slug when available. */
export function adUrl(ad: { id: string; slug?: string | null }): string {
  return `/ad/${ad.slug || ad.id}`;
}
