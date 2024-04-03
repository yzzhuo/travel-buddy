
import { seed } from '@/lib/seed'
import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let data;
    let startTime = Date.now()
    try {
      data = await sql`SELECT * FROM users`
      res.status(200).json(data);
    } catch (e: any) {
      if (e.message.includes('relation "users" does not exist')) {
        console.log(
          'Table does not exist, creating and seeding it with dummy data now...'
        )
        // Table is not created yet
        await seed()
        startTime = Date.now()
        data = await sql`SELECT * FROM users`
        res.status(200).json(data);
      } else {
        res.status(500).json({ error: e.message });
        throw e
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
