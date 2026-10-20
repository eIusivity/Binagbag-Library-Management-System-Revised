import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const ac = createAccessControl(defaultStatements);

export const patron = ac.newRole({
  user: [],
  session: [],
});

export const librarian = ac.newRole({
  user: ["list", "get", "update", "ban", "delete", "set-password"],
  session: [],
});

export const administrator = ac.newRole({
  user: [
    "create",
    "list",
    "get",
    "update",
    "set-role",
    "ban",
    "delete",
    "set-password",
    "set-email",
  ],
  session: ["list", "revoke", "delete"],
});
