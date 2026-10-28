import "dotenv/config";
import { auth } from "./auth.js";

async function seedAdmin() {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: "Emeline Sunga",
        email: "emelinesunga@gmail.com",
        password: "admin12345",
        first_name: "Emeline",
        last_name: "Sunga",
        user_type: "Faculty",
      },
    });

    console.log("Account created. User ID:", result.user.id);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create account:", error.message);
    process.exit(1);
  }
}

seedAdmin();
