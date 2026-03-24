/**
 * Vercel serverless function: receives inquiry (email) and creates a record in Airtable.
 *
 * Set these environment variables in Vercel (Project → Settings → Environment Variables):
 *   AIRTABLE_API_KEY  - Personal access token with data.records:write
 *   AIRTABLE_BASE_ID  - Base ID (starts with "app...")
 *   AIRTABLE_TABLE_ID - Table ID (starts with "tbl...") or table name
 *   AIRTABLE_EMAIL_FIELD - (Optional) Name of the email field. Default: "Email"
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_TABLE_ID
  const emailField = process.env.AIRTABLE_EMAIL_FIELD || 'Email'

  if (!apiKey || !baseId || !tableId) {
    console.error('Missing Airtable env vars')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const body = typeof req.body === 'object' ? req.body : {}
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: { [emailField]: email },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('Airtable error:', response.status, errText)
    let detail = 'Failed to save inquiry'
    try {
      const errJson = JSON.parse(errText)
      if (errJson.error?.message) detail = errJson.error.message
    } catch {}
    return res.status(response.status).json({ error: detail })
  }

  return res.status(200).json({ ok: true })
}
