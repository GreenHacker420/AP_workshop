import mysql from 'mysql2/promise';

let db;

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contact_db'

});

db = connection;

export default db;