import express from 'express';
    import sqlite3 from 'sqlite3';
    import { fileURLToPath } from 'url';
    import path from 'path';
    import cors from 'cors';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    import { v4 as uuidv4 } from 'uuid';

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const app = express();
    const db = new sqlite3.Database('./notes.db');

    // Initialize database with demo user
    db.serialize(async () => {
      // Create tables
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )`);
      
      // Check and create demo user
      const demoEmail = 'demo@ai.ai';
      const demoPassword = 'demo';
      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      
      db.get("SELECT * FROM users WHERE email = ?", [demoEmail], (err, row) => {
        if (!row) {
          db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [demoEmail, hashedPassword]
          );
        }
      });
    });

    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));
    app.use(express.json());

    // Authentication endpoints
    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
          if (err) throw err;
          
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
          
          const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
          res.json({ token });
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/register', async (req, res) => {
      try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
          'INSERT INTO users (email, password) VALUES (?, ?)',
          [email, hashedPassword],
          function(err) {
            if (err) {
              return res.status(400).json({ error: 'Registration failed. Email may already exist.' });
            }
            const token = jwt.sign({ id: this.lastID }, 'secret', { expiresIn: '1h' });
            res.json({ token });
          }
        );
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Serve static files
    app.use(express.static(path.join(__dirname, '../dist')));

    // Handle all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    });

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
