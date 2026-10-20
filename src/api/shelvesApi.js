import { BASE_URL } from "./apiConfig.js";

export async function getShelves() {
  const response = await fetch(`${BASE_URL}/shelf`);
  if (!response.ok) throw new Error("Failed to load shelves");
  return response.json();
}
