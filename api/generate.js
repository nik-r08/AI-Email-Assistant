import OpenAI from 'openai';

// This is where your secret key will be used.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export default async function handler(req, res) {
  // The important CORS headers are now handled by the vercel.json file.
  // We still need to handle the browser's preflight 'OPTIONS' request.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle only POST requests for the actual AI call.
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
    // This will help us see any errors on the Vercel logs.
    console.error("Error in handler:", error);
    res.status(500).json({ error: 'Failed to generate email due to a server error.' });
  }
}
