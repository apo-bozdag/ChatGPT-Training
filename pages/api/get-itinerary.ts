// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";
type Data = {
  message: string,
  itinerary_text: any,
}

const configuration = new Configuration({ apiKey: process.env.GPT_API_KEY });
const openAi = new OpenAIApi(configuration);


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
    const response = await openAi.createEmbedding({
      model: "gpt-3.5-turbo",
      input: basePrompt
    });

    const [{ embedding }] = response.data.data;

    let itinerary_text;
    if (embedding) {
      itinerary_text = embedding
    }


    res.status(200).json({
      message: 'success',
      itinerary_text
    })

  } catch (err) {
    console.log('error: ', err)
  }
}
