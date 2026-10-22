import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import {
  ac,
  patron,
  librarian,
  administrator,
} from "../../backend/auth/permission";
export const authClient = createAuthClient({
  baseURL: "https://binagbag-library-management-system.onrender.com",
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
