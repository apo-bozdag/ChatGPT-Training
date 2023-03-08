import {Button, Card, Col, Container, Grid, Input, Loading, Row, Spacer, Text} from '@nextui-org/react';
import React, {useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/header'
import MapContainer from "@/components/map";
const GOOGLE_MAP_KEY = process.env.GS_KEY
export default function Home() {
    const [request, setRequest] = useState<{ days?: string, city?: string }>({})
    let [itinerary, setItinerary] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [points, setPoint] = useState([])

    async function getItinerary() {
        const response = await fetch('/api/get-itinerary', {
            method: 'POST',
            body: JSON.stringify({
                days: request.days,
                city: request.city
            })
        })
        return await response.json()
    }

    async function getPointsOfInterest(pointsOfInterestPrompt) {
        const response = await fetch('/api/get-points-of-interest', {
            method: 'POST',
            body: JSON.stringify({
                pointsOfInterestPrompt: pointsOfInterestPrompt,
            })
        })
        return await response.json()
    }

    async function getPlaceDetails(pointsOfInterest) {
        const response = await fetch('/api/get-locations', {
            method: 'POST',
            body: JSON.stringify({
                pointsOfInterest: pointsOfInterest,
                city: request.city
            })
        })
        return await response.json()
    }

    async function hitAPI() {
        if (!request.city || !request.days) return
        if (loading) return
        setMessage('Building itinerary...')
        setLoading(true)
        setItinerary('')
        setPoint([])

        // get itinerary
        const get_itinerary = await getItinerary()
        let itinerary_text = get_itinerary.itinerary_text

        setItinerary(itinerary_text)
        setMessage('Places are sorted ...')

        let pointsOfInterestPrompt = 'Extract the main points of interest out of this text, with no additional words, only the names of the locations, separated by commas: ' + itinerary_text

        // get points of interest
        const get_points_interest_result = await getPointsOfInterest(pointsOfInterestPrompt)
        let pointsOfInterest = JSON.parse(get_points_interest_result.pointsOfInterest)
        pointsOfInterest.map(point => {
            itinerary_text = itinerary_text.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
        })

        setItinerary(itinerary_text)
        setMessage('Place details are being taken ...')

        // get place details
        const get_place_details = await getPlaceDetails(get_points_interest_result.pointsOfInterest)
        setPoint(get_place_details.locations)
        setMessage('')

        console.log('points', points)

        setLoading(false)
    }

    let days = itinerary.split('Day')

    if (days.length > 1) {
        days.shift()
    } else {
        days[0] = "1" + days[0]
    }
    return (
        <Container gap={0} fluid>
            <Header title="ChatGPT 💙 Tripian"/>
            <Row gap={1}>
                <Col>
                    <Text
                        h1
                        size={60}
                        css={{
                            textGradient: "45deg, $blue600 -20%, $red600 50%",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                        }}
                        weight="bold"
                    >
                        ChatGPT to Tripian
                    </Text>
                </Col>
            </Row>
            <Row gap={1}>
                <Col>
                    <Card>
                        <Card.Body>
                            <Grid.Container gap={1}>
                                <Grid xs={12} css={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    display: "flex",
                                }}>
                                    <Input placeholder="City" onChange={e => setRequest(request => ({
                                        ...request, city: e.target.value
                                    }))}/>
                                    <Input placeholder="Days" onChange={e => setRequest(request => ({
                                        ...request, days: e.target.value
                                    }))}/>
                                    <Button className="input-button" onClick={hitAPI}>
                                        {
                                            loading ?
                                                <Loading type="points" color="currentColor" size="sm"/>
                                                :
                                                'Build Itinerary'
                                        }
                                    </Button>


                                </Grid>
                            </Grid.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Spacer y={1}/>
            <Row gap={1}>
                <Grid.Container gap={1} justify="center">
                    <Grid xs={12} sm={6} css={{minHeight: 150}}>
                        {
                            loading && (
                                <Loading color="primary" textColor="primary"
                                         size="lg"
                                         css={{
                                             position: "absolute",
                                             bgBlur: "#ffffff66",
                                             borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                                             bottom: 0,
                                             paddingTop: 24,
                                             zIndex: 1,
                                             width: "100%",
                                             height: "100%",
                                             left: 0,
                                             borderRadius: 8,
                                         }}>
                                    {message}
                                </Loading>
                            )
                        }
                        <Text h6 size={15} color="white" css={{m: 0}}>
                            {
                                itinerary && days.map((day, index) => (
                                    <div
                                        style={{marginBottom: '30px'}}
                                        key={index}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: props => {
                                                    return <a target="_blank" rel="noopener noreferrer"
                                                              href={props.href}>{props.children}</a>
                                                }
                                            }}
                                        >
                                            {`Day ${day}`}
                                        </ReactMarkdown>
                                    </div>
                                ))
                            }
                        </Text>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        {
                            points.length > 0 && (
                                <MapContainer locations={points} gm_key={GOOGLE_MAP_KEY}/>
                            )
                        }
                    </Grid>
                </Grid.Container>
            </Row>
        </Container>
    );
}
