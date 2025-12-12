import { mimeScore } from "./mime";
import { extMimeScore, extScore } from "./extension";
import { EXTENSION_SCORES } from "./scoreTable";

export const mimeExtensionScore = (
  mimeType: string,
  ext: string,
  source: string = "default"
) => {
  const mimeScoreValue = mimeScore(mimeType, source);

  const extScore =
    EXTENSION_SCORES[ext] ?? extMimeScore(mimeType, ext, mimeScoreValue);

  return mimeScoreValue * 1.5 + extScore; // weighting favored toward MIME authority
};

export { mimeScore, extScore };
