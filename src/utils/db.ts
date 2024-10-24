import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../data/photos.db'));

// Initialize the database with required tables
db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filepath TEXT NOT NULL,
    user_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    description TEXT,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL
  )
`);

export interface PhotoMetadata {
  filepath: string;
  userId: string;
  timestamp: number;
  description: string;
  title: string;
  originalFilename: string;
}

export function savePhotoMetadata(metadata: PhotoMetadata): number {
  const stmt = db.prepare(`
    INSERT INTO photos (filepath, user_id, timestamp, description, title, original_filename)
    VALUES (@filepath, @userId, @timestamp, @description, @title, @originalFilename)
  `);

  const result = stmt.run(metadata);
  return result.lastInsertRowid as number;
}

export function getPhotosByUserId(userId: string) {
  const stmt = db.prepare('SELECT * FROM photos WHERE user_id = ? ORDER BY timestamp DESC');
  return stmt.all(userId);
}

export function getAllPhotos() {
  const stmt = db.prepare('SELECT * FROM photos ORDER BY timestamp DESC');
  return stmt.all();
}

export default db;