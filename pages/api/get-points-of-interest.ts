// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  pointsOfInterest: any,
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

  const { pointsOfInterestPrompt } = JSON.parse(req.body)
  let get_poi_names;
  try {
    get_poi_names = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: pointsOfInterestPrompt,
        temperature: 0,
        max_tokens: 500
      })
    })
  } catch (err) {
    console.error('get_poi_names error: ', err)
  }

  let pointsOfInterestArray = [];

  if (get_poi_names) {
    let pointsOfInterest = await get_poi_names.json()
    if (pointsOfInterest.choices && pointsOfInterest.choices.length > 0) {
      let poi_list = pointsOfInterest.choices[0]
      poi_list = poi_list.text.split('\n')
      poi_list = poi_list[poi_list.length - 1]
      poi_list = poi_list.split(',')
      pointsOfInterestArray = poi_list.map(i => i.trim())
    }
  }

  res.status(200).json({
    pointsOfInterest: JSON.stringify(pointsOfInterestArray)
  })
}
