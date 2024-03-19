import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        // @ts-ignore
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.reviews.text.text'
        },
        body: JSON.stringify({
          languageCode: 'en',
          textQuery: req.body.textQuery // Or your own predefined query string.
        })
      });
      const data = await response.json();
      res.status(200).json(data);
    
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
