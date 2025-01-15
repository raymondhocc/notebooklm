const express = require('express');
    const cors = require('cors');
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(':memory:');

    const app = express();
    app.use(cors());
    app.use(express.json());

    db.serialize(() => {
      db.run('CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)');
    });

    app.get('/notes', (req, res) => {
      db.all('SELECT * FROM notes', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.post('/notes', (req, res) => {
      const { title, content } = req.body;
      db.run('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      });
    });

    app.listen(3001, () => {
      console.log('Server running on http://localhost:3001');
    });
