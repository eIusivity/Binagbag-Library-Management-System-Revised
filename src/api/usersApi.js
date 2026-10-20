import { BASE_URL } from "./apiConfig.js";
export async function getUserCount() {
  const response = await fetch(`${BASE_URL}/user`);
  if (!response.ok) throw new Error("Failed to get user count");
  return response.json();
}
export async function createUser(user) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getUser(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to get user");
  return response.json();
}
export async function getUserByLibraryID(libraryid) {
  const response = await fetch(`${BASE_URL}/user/library/${libraryid}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getUserProfileLibrarySummary(libraryId) {
  const response = await fetch(`${BASE_URL}/user/summary/${libraryId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
