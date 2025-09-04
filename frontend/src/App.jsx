import { useState, useEffect } from 'react'
import './app.css'

function App() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Filter and sort states
  const [filterName, setFilterName] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [filterPhone, setFilterPhone] = useState('')
  const [sortBy, setSortBy] = useState('') // values: "", "name_asc", "name_desc", "email_asc", "email_desc"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Toggle sort cycle
  const toggleSort = (field) => {
    setSortBy((prev) => {
      if (!prev.startsWith(field)) return `${field}_asc`
      if (prev === `${field}_asc`) return `${field}_desc`
      return '' // reset
    })
  }

  // Fetch contacts function
  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterName) params.append('name', filterName)
      if (filterEmail) params.append('email', filterEmail)
      if (filterPhone) params.append('phone', filterPhone)
      if (sortBy) params.append('sort', sortBy)

      const res = await fetch(`http://localhost:5555/contacts?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch contacts')
      const data = await res.json()
      setContacts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Debounced effect for filters/sort
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchContacts()
    }, 400)
    return () => clearTimeout(delay)
  }, [filterName, filterEmail, filterPhone, sortBy])

  // Add new contact
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5555/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      })
      if (!res.ok) throw new Error('Failed to add contact')

      setName('')
      setEmail('')
      setPhone('')
      fetchContacts()
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '1em' }}>
      <h1>Contacts</h1>

      {/* Filter Controls */}
      <div style={{ marginBottom: '1em' }}>
        <input
          type="text"
          placeholder="Filter by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Phone"
          value={filterPhone}
          onChange={(e) => setFilterPhone(e.target.value)}
        />
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Contacts Table */}
      {!loading && !error && (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>
                Name
                <button onClick={() => toggleSort('name')}>
                  {sortBy === 'name_asc' ? '▲' : sortBy === 'name_desc' ? '▼' : '⇅'}
                </button>
              </th>
              <th>
                Email
                <button onClick={() => toggleSort('email')}>
                  {sortBy === 'email_asc' ? '▲' : sortBy === 'email_desc' ? '▼' : '⇅'}
                </button>
              </th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, idx) => (
                <tr key={contact.id || idx}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add Contact Form */}
      <h2 style={{ marginTop: '2em' }}>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default App
