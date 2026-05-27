import * as dotenv from "dotenv";

import express, { type Request, type Response } from "express";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";
import { processDashboardData, processChat, getActiveNotifications } from "./ai/aiEngine.js";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("REDIRECT:", process.env.GOOGLE_REDIRECT_URI);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const tokensPath = path.resolve("tokens.json");

const loadTokens = () => {
  if (fs.existsSync(tokensPath)) {
    const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));
    oauth2Client.setCredentials(tokens);
    return true;
  }
  return false;
};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from @neverlate/server!");
});

app.get("/api/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.json({ url });
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(tokensPath, JSON.stringify(tokens));
    res.redirect("http://localhost:5173/sources"); // Or frontend root
  } catch (error) {
    console.error("Error retrieving access token", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/google/status", async (req, res) => {
  if (loadTokens()) {
    try {
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      res.json({ connected: true, email: userInfo.data.email });
    } catch (e) {
      res.json({ connected: false });
    }
  } else {
    res.json({ connected: false });
  }
});

app.post("/api/google/disconnect", (req, res) => {
  if (fs.existsSync(tokensPath)) {
    fs.unlinkSync(tokensPath);
  }
  oauth2Client.setCredentials({});
  res.json({ success: true });
});

async function fetchEmailsData() {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 15, // slightly more for AI processing
  });

  const messages = response.data.messages || [];
  const emailData = await Promise.all(
    messages.map(async (msg) => {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });

      const headers = message.data.payload?.headers || [];
      const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
      const sender = headers.find((h) => h.name === "From")?.value || "Unknown Sender";
      const date = headers.find((h) => h.name === "Date")?.value || "";

      return {
        id: msg.id as string,
        subject,
        sender,
        snippet: message.data.snippet || "",
        date,
      };
    })
  );
  return emailData;
}

async function fetchCalendarData() {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 15,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items || [];
  return events.map((event) => ({
    id: event.id as string,
    title: event.summary || "",
    start: (event.start?.dateTime || event.start?.date) as string,
    end: (event.end?.dateTime || event.end?.date) as string,
    location: event.location || "",
  }));
}

app.get("/api/google/emails", async (req, res) => {
  if (!loadTokens()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const data = await fetchEmailsData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching emails", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

app.get("/api/google/calendar", async (req, res) => {
  if (!loadTokens()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const data = await fetchCalendarData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching calendar events", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

// AI Endpoints
app.get("/api/ai/dashboard", async (req, res) => {
  if (!loadTokens()) return res.status(401).json({ error: "Not authenticated" });
  try {
    const emails = await fetchEmailsData();
    const events = await fetchCalendarData();
    const data = await processDashboardData(emails, events);
    res.json(data);
  } catch (error) {
    console.error("Error in AI dashboard", error);
    res.status(500).json({ error: "Failed to process AI dashboard data" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  if (!loadTokens()) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { query } = req.body;
    const emails = await fetchEmailsData();
    const events = await fetchCalendarData();
    const reply = await processChat(query, emails, events);
    res.json({ reply });
  } catch (error) {
    console.error("Error in AI chat", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

app.get("/api/ai/notifications", async (req, res) => {
  if (!loadTokens()) return res.status(401).json({ error: "Not authenticated" });
  try {
    const emails = await fetchEmailsData();
    const events = await fetchCalendarData();
    const notifications = getActiveNotifications(emails, events);
    res.json(notifications);
  } catch (error) {
    console.error("Error in AI notifications", error);
    res.status(500).json({ error: "Failed to process notifications" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
