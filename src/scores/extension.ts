import {
  EXTENSION_SCORES,
  SOURCE_SCORES,
  CATEGORY_EXTENSION_FALLBACK,
} from "./scoreTable";

/**
 * Get a score for an extension
 *
 * @param ext
 * @param source
 * @returns
 */
export const extScore = (ext: string, source: string = "default"): number => {
  ext = ext.toLowerCase().replace(/^\./, "");

  const baseScore = EXTENSION_SCORES[ext] ?? EXTENSION_SCORES.default;

  // Prefer shorter extensions
  const lengthBonus = 1 - ext.length / 10;

  // Optional: incorporate source credibility
  const sourceBonus = SOURCE_SCORES[source] ?? SOURCE_SCORES.default;

  return baseScore + lengthBonus + sourceBonus;
};

/**
 * Get a score for an extension based on its mime type
 *
 * @param mime
 * @param ext
 * @param mimeScoreValue
 * @returns
 */
export function extMimeScore(
  mime: string,
  ext: string,
  mimeScoreValue: number
): number {
  const [type] = mime.split("/");

  const base =
    CATEGORY_EXTENSION_FALLBACK[type] ?? CATEGORY_EXTENSION_FALLBACK.default;

  const namePenalty = (ext.length - 3) * 2; // shorter = cleaner
  const symbolPenalty = /[^a-z0-9]/.test(ext) ? 20 : 0;

  return Math.max(
    Math.round(
      base +
        mimeScoreValue * 0.25 - // MIME authority contributes
        namePenalty -
        symbolPenalty
    ),
    10
  );
}
