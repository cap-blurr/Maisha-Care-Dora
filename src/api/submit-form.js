import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Form submission failed');
      }
      
      res.status(200).json(data);
    } catch (error) {
      console.error('API route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}