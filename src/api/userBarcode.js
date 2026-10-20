import { BASE_URL } from "./apiConfig.js";

export async function generateUserBarcode() {
  const barcode = await fetch(`${BASE_URL}/barcode/create`, {
    method: "GET",
  });
}
