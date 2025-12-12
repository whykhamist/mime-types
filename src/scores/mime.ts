import { FACET_SCORES, SOURCE_SCORES, TYPE_SCORES } from "./scoreTable";

/**
 * Safely extracts the RFC 6838 "facet" of a subtype.
 * Returns a string ending in '.' or '-' that represents the facet prefix.
 *
 * Examples:
 *  'vnd.ms-excel' → 'vnd.'
 *  'x-ms-bmp' → 'x-'
 *  'prs.mytype' → 'prs.'
 *  'json' → ''
 */
const extractFacet = (subtype: string): string => {
  if (!subtype || typeof subtype !== "string") return "";

  // RFC facets start with: vnd., prs., x- , x.
  // Find the earliest valid facet prefix.
  const facetMatch = subtype.match(/^(vnd\.|prs\.|x-|x\.)/);
  return facetMatch ? facetMatch[1] : "";
};

/**
 * Get each component of the score for a mime type.  The sum of these is the
 * total score.  The higher the score, the more "official" the type.
 */
export const mimeScore = (mimeType: string, source: string = "default") => {
  if (mimeType === "application/octet-stream") {
    return 0;
  }

  const parts = mimeType.split("/");

  if (parts.length !== 2) {
    // Invalid mime type; score it lowest to avoid being selected accidentally
    return 0;
  }

  const [type, subtype] = parts;

  const facet = extractFacet(subtype);

  const facetScore = FACET_SCORES[facet] ?? FACET_SCORES.default;
  const sourceScore = SOURCE_SCORES[source] ?? SOURCE_SCORES.default;
  const typeScore = TYPE_SCORES[type] ?? TYPE_SCORES.default;

  // All else being equal prefer shorter types
  const lengthScore = 1 - mimeType.length / 100;

  return facetScore + sourceScore + typeScore + lengthScore;
};
