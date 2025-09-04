import db from './db.js';
import express from 'express';
import cors from 'cors';
import { getContacts, postContacts } from './functions.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/contacts', getContacts);
app.get('/contacts/:id', getContacts);

app.post('/contacts', postContacts);

app.listen(5555, () => {
  console.log('Server is running on port 5555');
});
