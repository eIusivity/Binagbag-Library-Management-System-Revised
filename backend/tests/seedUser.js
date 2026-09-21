import { auth } from "../auth/auth.js";
import "dotenv/config";
const users = [
  "Alice Santos",
  "Ben Cruz",
  "Carlo Reyes",
  "Diana Garcia",
  "Ethan Mendoza",
  "Faith Ramos",
  "Gabriel Flores",
  "Hannah Torres",
  "Ivan Bautista",
  "Julia Aquino",
  "Kevin Castillo",
  "Lara Navarro",
];

for (let i = 0; i < users.length; i++) {
  const name = users[i];

  await auth.api.signUpEmail({
    body: {
      name,
      email: `test${i + 1}@example.com`,
      password: "Test123456!",
      user_type: "Student",
    },
  });

  console.log(`Created: ${name}`);
}

console.log("12 test users created.");
process.exit(0);
