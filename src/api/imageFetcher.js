import { BASE_URL } from "./apiConfig.js";

export function getImageUrl(imageName) {
  if (!imageName) return null;

  return `${BASE_URL}/image/${imageName}`;
}
