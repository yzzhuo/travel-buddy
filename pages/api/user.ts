
import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'GET') {
    let data;
    let startTime = Date.now()
    try {
      data = await prisma.users.findMany()
      res.status(200).json(data);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
