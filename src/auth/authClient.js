import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import {
  ac,
  patron,
  librarian,
  administrator,
} from "../../backend/auth/permission";
export const authClient = createAuthClient({
  baseURL: "http://192.168.1.6:5000",
  plugins: [
    adminClient({
      ac,
      roles: {
        Patron: patron,
        Librarian: librarian,
        Administrator: administrator,
      },
    }),
  ],
});
