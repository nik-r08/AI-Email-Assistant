import OpenAI from 'openai';

// This is where your secret key will be used.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export default async function handler(req, res) {
  // Add CORS headers to allow your extension to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // The browser sends an OPTIONS request first, handle it
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional email assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
    });
    
    const generatedEmail = completion.choices[0].message.content;
    res.status(200).json({ completion: generatedEmail });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
}
