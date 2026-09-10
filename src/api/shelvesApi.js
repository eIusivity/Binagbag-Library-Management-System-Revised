const BASE_URL = "http://localhost:3000/shelf";

export async function getShelves() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to load shelves");
  return response.json();
}
