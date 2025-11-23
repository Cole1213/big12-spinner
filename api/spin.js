import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { team } = req.body;

  if (!team) {
    return res.status(400).json({ error: 'Team is required' });
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

    // Insert the spin result
    await sql`
      INSERT INTO spin_results (team) 
      VALUES (${team})
    `;

    // Get updated results
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
    res.status(500).json({ error: 'Failed to record spin', details: error.message });
  }
}