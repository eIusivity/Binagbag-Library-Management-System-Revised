const BASE_URL = "http://localhost:3000/books";

export async function getBooks() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to load books");
  return response.json();
}
export async function getBook(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to load books");
  return response.json();
}
export async function createBook(book) {
  const response = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function updateBook(id, book) {
  const response = await fetch(`${BASE_URL}/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function deleteBook(id) {
  const response = await fetch(`${BASE_URL}/${id}/delete`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
