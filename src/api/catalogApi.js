import { BASE_URL } from "./apiConfig";

export async function searchBooks(searchObject) {
  const response = await fetch(`${BASE_URL}/category/fetch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchObject),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}
export async function fetchBookProfile(bookId) {
  const response = await fetch(`${BASE_URL}/category/fetch/${bookId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}
export async function fetchBooksSummary(bookId) {
  const response = await fetch(`${BASE_URL}/category/summary/${bookId}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
}
