import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/submit-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Could not submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <header className="site-header">The Alpine Touring Club</header>

    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="content">
        <p className="tagline">A Society Of Friends Earning Our Turns</p>

        <div className="waitlist-section">
          {submitted ? (
            <p className="success-message">Thanks For Signing Up. We'll Be In Touch.</p>
          ) : (
            <>
              {error && <p className="error-message">{error}</p>}
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setError(null) || setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
                <button type="submit" className="waitlist-btn" disabled={loading}>
                  {loading ? 'Sending…' : 'Membership Inquiry'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>

    <section className="secondary">
      <img
        src="/ski-art.png"
        alt="Alpine touring skiers earning their turns in the mountains"
        className="secondary-image"
      />
    </section>

    <footer className="site-footer">
        The Alpine Touring Club<br />
        <span className="footer-year">circa 2026</span>
      </footer>
    </>
  )
}

export default App
