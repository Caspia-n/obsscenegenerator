import pool from './client';
import { promises as fs } from 'fs';
import path from 'path';

export async function initializeDatabase(): Promise<void> {
  try {
    const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    await pool.query(schema);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run this if executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}
