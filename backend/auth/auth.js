import "dotenv/config";
import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";
import { admin } from "better-auth/plugins";
import { ac, patron, librarian, administrator } from "./permission.js";
import bcrypt from "bcrypt";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [process.env.CLIENT_URL],

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
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
      status_reason: {
        type: "string",
        required: false,
        input: false,
      },
      first_name: {
        type: "string",
        required: true,
        input: true,
      },
      middle_name: {
        type: "string",
        required: false,
        input: true,
      },
      last_name: {
        type: "string",
        required: true,
        input: true,
      },
      library_id: {
        type: "string",
        required: false,
        input: false,
        unique: true,
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
  plugins: [
    admin({
      ac,
      roles: {
        Patron: patron,
        Librarian: librarian,
        Administrator: administrator,
      },
      defaultRole: "Patron",
    }),
  ],
});
