import { BASE_URL } from "./apiConfig";

export async function getTotalBorrows(datesObject) {
  const params = new URLSearchParams(datesObject);

  const response = await fetch(
    `${BASE_URL}/report/totalBorrows?${params.toString()}`,
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getTotalReturns(datesObject) {
  const params = new URLSearchParams(datesObject);

  const response = await fetch(
    `${BASE_URL}/report/totalReturns?${params.toString()}`,
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getLoanReportRecords(datesObject) {
  const params = new URLSearchParams(datesObject);

  const response = await fetch(
    `${BASE_URL}/report/recordsTable?${params.toString()}`,
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function getBookInventorySummary() {
  const response = await fetch(`${BASE_URL}/report/books/summary`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}
export async function getBookInventoryRecords() {
  const response = await fetch(`${BASE_URL}/report/books/records`);

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}
export async function getReservationSummary(datesObject) {
  const params = new URLSearchParams(datesObject);

  const response = await fetch(
    `${BASE_URL}/report/reservations/summary?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}
export async function getReservationReportRecords(datesObject) {
  const params = new URLSearchParams(datesObject);

  const response = await fetch(
    `${BASE_URL}/report/reservations/records?${params.toString()}`,
    { credentials: "include" },
  );

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}
