import db from './db.js';
import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors('http://localhost:5173'));
app.use(express.json());


app.get('/contacts/:id?', async (req, res) => {
  try {
    const { id } = req.params;
    let contacts = [];
    if (id) {
      const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      contacts = rows;
    } else {
      const [rows] = await db.query('SELECT * FROM contacts');
      contacts = rows;
    }
    const { name, email, phone, sort } = req.query;

    // Filtering
    let filtered = contacts.filter(contact => {
      return (
        (!name || contact.name.toLowerCase().includes(name.toLowerCase())) &&
        (!email || contact.email.toLowerCase().includes(email.toLowerCase())) &&
        (!phone || contact.phone.includes(phone))
      );
    });

    // Sorting
    if (sort) {
      let [field, direction] = sort.split('_'); // e.g. "name_desc"
      if (!direction) direction = 'asc'; // default to ascending if not provided

      filtered.sort((a, b) => {
        if (!a[field] || !b[field]) return 0;
        const result = a[field].toString().localeCompare(b[field].toString());
        return direction === 'desc' ? -result : result;
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/contacts', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const [result] = await db.query('INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
        res.status(201).json({ id: result.insertId, name, email, phone });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5555, () => {
  console.log('Server is running on port 5555');
});
