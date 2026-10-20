import { BASE_URL } from "./apiConfig";

export async function getAllReservations() {
  const response = await fetch(`${BASE_URL}/reservations/all`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function createReservation(recordObject) {
  const response = await fetch(`${BASE_URL}/reservations/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recordObject),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function fulfillReservation(recordObject) {
  const response = await fetch(`${BASE_URL}/reservations/fulfill`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recordObject),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getReservationByLibraryId(libraryId) {
  const response = await fetch(`${BASE_URL}/reservations/${libraryId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getReservations(search = "", page = 1) {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page.toString());
  const url = params.size
    ? `${BASE_URL}/reservations?${params.toString()}`
    : `${BASE_URL}/reservations`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load records");
  }
  return response.json();
}
export async function cancelReservation(reservationId) {
  const response = await fetch(
    `${BASE_URL}/reservations/cancel/${reservationId}`,
    { method: "PUT" },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
