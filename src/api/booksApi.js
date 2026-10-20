import { BASE_URL } from "./apiConfig.js";

export async function getBooks(search = "", page = 1) {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page.toString());
  const url = params.size
    ? `${BASE_URL}/books?${params.toString()}`
    : `${BASE_URL}/books`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load books");
  }
  return response.json();
}
export async function getBook(id) {
  const response = await fetch(`${BASE_URL}/books/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function createBook(book) {
  const response = await fetch(`${BASE_URL}/books/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function updateBook(id, book) {
  const response = await fetch(`${BASE_URL}/books/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function deleteBook(id) {
  const response = await fetch(`${BASE_URL}/books/${id}/delete`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
