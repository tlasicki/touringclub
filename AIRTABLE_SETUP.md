# Airtable setup for membership inquiries

Submissions from the **Membership Inquiry** form are sent to a Vercel serverless function, which creates a record in your Airtable base.

## 1. Create an Airtable base and table

1. In [Airtable](https://airtable.com), create a base (or use an existing one).
2. Create a table with at least one field for the email, e.g. **Email** (Single line text or Email type).
3. Copy your **Base ID**: open the base, go to Help → API documentation. The Base ID looks like `appXXXXXXXXXXXXXX`.
4. Copy your **Table ID**: in the API docs, the table ID looks like `tblXXXXXXXXXXXXXX` (you can also use the table name, but the ID is more reliable).

## 2. Create a Personal Access Token

1. Go to [Airtable Account → Developer](https://airtable.com/create/tokens).
2. Create a new token with scope **data.records:write** (and read if you want).
3. Give it access to the base you use for membership inquiries.
4. Copy the token (starts with `pat...`).

## 3. Set environment variables in Vercel

In your Vercel project: **Project → Settings → Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `AIRTABLE_API_KEY` | Your personal access token (e.g. `pat...`) |
| `AIRTABLE_BASE_ID` | Base ID (e.g. `app...`) |
| `AIRTABLE_TABLE_ID` | Table ID (e.g. `tbl...`) or the table name |
| `AIRTABLE_EMAIL_FIELD` | (Optional) Name of the email field in the table. Default is `Email`. |

Redeploy the project after changing env vars so the function picks them up.

## 4. Deploy and test

Deploy the site to Vercel (connect the repo or run `vercel --prod`). Submit the form with an email; a new row should appear in your Airtable table.

**Local testing:** Run `vercel dev` so the API route runs locally. Use a `.env.local` file with the same variables. Do not commit `.env.local` or your API key.
