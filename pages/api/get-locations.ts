// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
    locations: any,
}

const GS_KEY = process.env.GS_KEY

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    let {pointsOfInterest, city} = JSON.parse(req.body)
    pointsOfInterest = JSON.parse(pointsOfInterest)

    const locations: {}[] = []
    await Promise.all(pointsOfInterest.map(async point => {
        try {
            const GSURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${point + ' in ' + city}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${GS_KEY}`
            const response = await fetch(GSURL)
            const location = await response.json()
            console.log('location: ', location)

            if (location && location.results && location.results.length > 0) {
                let result = location.results[0]
                let name = result.name
                let photo_reference = result.photos && result.photos.length > 0 ? result.photos[0].photo_reference : null
                let lat = result.geometry.location.lat
                let lng = result.geometry.location.lng
                let place_id = result.place_id
                let types = result.types
                let image = photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_reference}&key=${GS_KEY}` : null
                locations.push(
                    {
                        point,
                        name,
                        location: {
                            lat,
                            lng,
                        },
                        place_id,
                        types,
                        image
                    }
                )
            }
        } catch (err) {
            console.log('error: ', err)
        }
    }))

    res.status(200).json({
        locations,
    })
}
