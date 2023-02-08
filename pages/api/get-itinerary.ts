// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string,
  itinerary_text: any,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let days = 4, city = 'Rio'
  if (req.body) {
    let body = JSON.parse(req.body)
    days = body.days
    city = body.city
  }

  if (days > 10) {
    days = 10
  }

  let basePrompt = `give me an itinerary for ${days} days in ${city}`
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 600
      })
    })
    const itinerary = await response.json()

    let itinerary_text;
    if (itinerary.choices.length > 0) {
      itinerary_text = itinerary.choices[0].text
    }


    res.status(200).json({
      message: 'success',
      itinerary_text
    })

  } catch (err) {
    console.log('error: ', err)
  }
}
