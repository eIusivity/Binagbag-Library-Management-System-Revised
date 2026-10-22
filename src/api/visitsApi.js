import { BASE_URL } from "./apiConfig";

export async function incrementVisit() {
  const response = await fetch(`${BASE_URL}/visits/increment`, {
    method: "POST",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getAllVisits() {
  const response = await fetch(`${BASE_URL}/visits/all`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getWeeklyVisit({ weeksAgo = 0 } = {}) {
  const params = new URLSearchParams({
    weeksAgo: String(weeksAgo),
  });

  const response = await fetch(
    `${BASE_URL}/visits/weekly?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get weekly visits.");
  }

  return data;
}
export async function getVisitsToday() {
  const response = await fetch(`${BASE_URL}/visits/today`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
