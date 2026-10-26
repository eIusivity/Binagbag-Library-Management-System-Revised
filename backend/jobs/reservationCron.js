import cron from "node-cron";
import { expireReservations } from "../services/expireReservation.js";

export function startReservationCron() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const affectedRows = await expireReservations();

        console.log(
          `[Reservation Cron] Expired ${affectedRows} reservation(s).`,
        );
      } catch (error) {
        console.error(
          "[Reservation Cron] Failed to expire reservations:",
          error,
        );
      }
    },
    {
      timezone: "Asia/Manila",
    },
  );
}
