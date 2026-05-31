# Configuring Coral Data Sources

NeverLate uses Coral to query connected productivity data sources such as Gmail and Google Calendar.

Before running the application with real data, you must configure your own Google APIs and register the Coral sources.

## Step 1 — Create a Google Cloud Project

1. Open the Google Cloud Console.
2. Create a new project.
3. Enable:
   - Gmail API
   - Google Calendar API

## Step 2 — Configure OAuth Consent Screen

1. Navigate to:
   APIs & Services → OAuth Consent Screen
2. Configure the application.
3. Add yourself as a test user if required.

## Step 3 — Create OAuth Credentials

1. Navigate to:
   APIs & Services → Credentials
2. Click:
   Create Credentials → OAuth Client ID
3. Select:
   Web Application

Add the following redirect URI:

```txt
https://developers.google.com/oauthplayground
```

Save the credentials and copy:

- Client ID
- Client Secret

## Step 4 — Generate Gmail Access Token

Open:

https://developers.google.com/oauthplayground

Click the gear icon and enable:

```txt
Use your own OAuth credentials
```

Paste your:

- Client ID
- Client Secret

In the "Input your own scopes" field enter:

```txt
https://www.googleapis.com/auth/gmail.readonly
```

Authorize the API and exchange the authorization code for tokens.

Copy the generated Access Token.

## Step 5 — Generate Google Calendar Access Token

Repeat the same process using:

```txt
https://www.googleapis.com/auth/calendar.readonly
```

Copy the generated Access Token.

## Step 6 — Register Coral Sources

Register the Gmail source:

```bash
coral source add --interactive --file ./apps/server/src/coral-sources/gmail/manifest.yaml
```

Paste your Gmail access token when prompted.

Register the Calendar source:

```bash
coral source add --interactive google_calendar
```

Paste your Google Calendar access token when prompted.

After registration, Coral can securely query your connected Gmail and Calendar data sources.