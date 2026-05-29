import { runCoralCommand } from "./utils/runCoralCommand.ts";

async function main() {
  try {
    const data = await runCoralCommand<any[]>("SELECT * FROM google_calendar.events LIMIT 1");
    console.log("=== Calendar Event Sample ===");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
