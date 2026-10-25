import cron from "node-cron";
import { overdueLoan } from "../services/overdueLoan.js";

export function startLoanCron() {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const affectedRows = await overdueLoan();

        console.log(`[Reservation Cron] Overdued ${affectedRows} loan(s).`);
      } catch (error) {
        console.error("[Reservation Cron] Failed to overdue loans:", error);
      }
    },
    {
      timezone: "Asia/Manila",
    },
  );
}
