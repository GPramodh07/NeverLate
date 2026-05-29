async function fetchAPIs() {
  try {
    console.log("=== /api/google/calendar ===");
    const calRes = await fetch("http://localhost:3000/api/google/calendar");
    console.log(JSON.stringify(await calRes.json(), null, 2));

    console.log("\n=== /api/ai/dashboard ===");
    const dashRes = await fetch("http://localhost:3000/api/ai/dashboard");
    console.log(JSON.stringify(await dashRes.json(), null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error("Fetch failed:", err);
    process.exit(1);
  }
}

fetchAPIs();
