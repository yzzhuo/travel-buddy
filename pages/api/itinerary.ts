import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv'
import { nanoid } from 'ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
      const id = nanoid();
      const data = await kv.set(`itinerary:${id}`, req.body);
      res.status(200)
        .json({data, id});
    
  } else if (req.method === 'GET') {
    const data = await kv.get(`itinerary:${req.query.id}`);
    res.status(200)
      .json(data);
} else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
