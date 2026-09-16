import { BASE_URL } from "./apiConfig.js";

export async function getBookCopies(bookId) {
  const response = await fetch(`${BASE_URL}/${bookId}`);
  if (!response.ok) throw new Error("Failed to load book copies");
  return response.json();
}
export async function getBookCopy(bookId, bookCopyId) {
  const response = await fetch(`${BASE_URL}/${bookId}/${bookCopyId}`);
  if (!response.ok) throw new Error("Failed to load book copy");
  return response.json();
}
export async function createBookCopies(bookId, copies) {
  const response = await fetch(`${BASE_URL}/${bookId}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(copies),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function updateBookCopy(bookCopyId, copy) {
  const response = await fetch(`${BASE_URL}/${bookCopyId}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(copy),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function deleteBookCopy(bookCopyId) {
  const response = await fetch(`${BASE_URL}/${bookCopyId}/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
