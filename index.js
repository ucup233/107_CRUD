const express = require('express');
let mysql = require('mysql2');
const app = express();
const PORT = 5001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '12345678',
  database: 'Mahasiswa',
  port: '3306'
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database.');
});

app.get('/api/mahasiswa', (req, res) => {
  
  const sql = 'SELECT * FROM biodata';
  
  db.query(sql, (err, results) => {
    if (err) {
        console.error('Error executing query:' + err.stack);
        res.status(500).send('Error fetching mahasiswa');
        return;
    }
    res.json(results);
  });
});

app.post('/api/mahasiswa', (req, res) => {  
    const { nama, alamat, agama } = req.body;  

    if (!nama || !alamat || !agama) {  
        return res.status(400).send('Nama, Alamat, Agama are required');  
    }  

    const sql = 'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)';  
    db.query(sql, [nama, alamat, agama], (err, result) => {  
        if (err) {  
            console.error('Error executing query:' + err.stack);  
            return res.status(500).send('Error adding mahasiswa');  
        }  
        res.status(201).send(`Mahasiswa added with ID: ${result.insertId}`);  
    });  
});

app.delete('/api/mahasiswa/:id', (req, res) => {  
    const userID = req.params.id;  

   db.query('DELETE FROM biodata WHERE id = ?', [userID], (err, result) => {  
        if (err) {  
            console.error('Error executing query:' + err.stack);  
            return res.status(500).send('Error deleting mahasiswa');  
        }
        res.json({ message: `Mahasiswa with ID: ${userID} deleted.` });  
    });  
});

app.put('/api/mahasiswa/:id', (req, res) => {  
    const userID = req.params.id;  
    const { nama, alamat, agama } = req.body;  
    db.query(  
        'UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?',  
        [nama, alamat, agama, userID],  
        (err, result) => {  
            if (err) {  
                console.error('Error executing query:' + err.stack);  
                return res.status(500).send('Error updating mahasiswa');  
            }  
            res.json({ message: `Mahasiswa with ID: ${userID} updated.` });  
        }  
    );  
});
