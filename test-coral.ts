import { getRecentEmails } from "./apps/server/src/services/coralService.ts";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    console.log("MOCK_MODE is:", process.env.MOCK_MODE);
    console.log("Running getRecentEmails()...");
    const emails = await getRecentEmails();
    console.log("Emails returned:");
    console.log(JSON.stringify(emails, null, 2));
  } catch (error) {
    console.error("Error in getRecentEmails:", error);
  }
}

main();
