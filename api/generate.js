import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  // Handle only POST requests for the actual AI call
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'A prompt is required.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional and helpful email assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
    });

    const generatedEmail = completion.choices[0].message.content;
    res.status(200).json({ completion: generatedEmail });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: 'Failed to generate email due to a server error.' });
  }
}
