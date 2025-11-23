import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS spin_results (
        id SERIAL PRIMARY KEY,
        team VARCHAR(50) NOT NULL,
        spun_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_team ON spin_results(team);
    `;

    // Get results
    const { rows } = await sql`
      SELECT team, COUNT(*) as count 
      FROM spin_results 
      GROUP BY team 
      ORDER BY count DESC
    `;

    const results = {};
    rows.forEach(row => {
      results[row.team] = parseInt(row.count);
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
}