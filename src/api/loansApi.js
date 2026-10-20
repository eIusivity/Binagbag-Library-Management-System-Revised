import { BASE_URL } from "./apiConfig";

export async function getAllLoans({ thisDayOnly = false } = {}) {
  const params = new URLSearchParams();

  if (thisDayOnly) params.set("thisDayOnly", "true");

  const url = params.size
    ? `${BASE_URL}/loans/all?${params.toString()}`
    : `${BASE_URL}/loans/all`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}
export async function getLoans(search = "", page = 1, limit = 5) {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set("search", search.trim());
  }
  params.set("page", page.toString());
  params.set("limit", limit.toString());
  const url = params.size
    ? `${BASE_URL}/loans?${params.toString()}`
    : `${BASE_URL}/loans`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load loans");
  }
  return response.json();
}
export async function getLoan(bookCopyId) {
  const response = await fetch(`${BASE_URL}/loans/${bookCopyId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function createLoans(loanData) {
  const response = await fetch(`${BASE_URL}/loans/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loanData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
export async function loanCheckin(recordsObject) {
  const response = await fetch(`${BASE_URL}/loans/checkin/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recordsObject),
  });
}
export async function getLoansOfUser(dataObject) {
  const response = await fetch(
    `${BASE_URL}/loans/loansOf/${dataObject.libraryId}?activeLoansOnly=${dataObject.activeLoansOnly}`,
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
