import express from 'express';
    import sqlite3 from 'sqlite3';
    import { fileURLToPath } from 'url';
    import path from 'path';
    import cors from 'cors';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    import pdf from 'pdf-parse';
    import nlp from 'compromise';
    import { v4 as uuidv4 } from 'uuid';

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const app = express();
    const db = new sqlite3.Database('./notes.db');

    // Initialize database
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )`);
      
      db.run(`CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        content TEXT,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`);
    });

    app.use(express.json());
    app.use(cors());

    // Serve static files from Vite build
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle all other routes by serving index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    // Authentication middleware and API endpoints remain the same...

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
