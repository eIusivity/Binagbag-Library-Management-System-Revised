import "dotenv/config";
import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import bcrypt from "bcrypt";

export const auth = betterAuth({
  trustedOrigins: ["http://192.168.1.6:5173"],
  database: createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "Z",
  }),
  user: {
    additionalFields: {
      role: {
        type: ["Patron", "Librarian", "Administrator"],
        required: true,
        defaultValue: "Patron",
        input: false,
      },
      user_type: {
        type: ["Student", "Faculty", "Non-Faculty"],
        required: true,
        input: true,
      },
      status: {
        type: ["Pending", "Active", "Closed", "Canceled", "Blacklisted"],
        required: true,
        defaultValue: "Pending",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,

    password: {
      hash: async (password) => {
        return bcrypt.hash(password, 10);
      },

      verify: async ({ hash, password }) => {
        return bcrypt.compare(password, hash);
      },
    },
  },
});
