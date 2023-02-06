import {
    useTheme,
    Container,
    Grid,
    Card,
    Row,
    Col,
    Spacer,
    Text,
    Input,
    Button,
    Loading
} from '@nextui-org/react';
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '../components/header'

export default function Home() {
    const { theme } = useTheme();
    const [request, setRequest] = useState<{days?: string, city?: string}>({})
    let [itinerary, setItinerary] = useState<string>('')

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    async function hitAPI() {
        if (!request.city || !request.days) return
        if (loading) return
        setMessage('Building itinerary...')
        setLoading(true)
        setItinerary('')

        // get itinerary
        const response = await fetch('/api/get-itinerary', {
            method: 'POST',
            body: JSON.stringify({
                days: request.days,
                city: request.city
            })
        })
        const json = await response.json()
        let itinerary = json.itinerary_text

        setItinerary(itinerary)
        setMessage('Places are sorted ...')

        // get points of interest
        const get_points_of_interest = await fetch('/api/get-points-of-interest', {
            method: 'POST',
            body: JSON.stringify({
                pointsOfInterestPrompt: json.pointsOfInterestPrompt,
            })
        })
        const get_points_interest_result = await get_points_of_interest.json()
        let pointsOfInterest = JSON.parse(get_points_interest_result.pointsOfInterest)
        pointsOfInterest.map(point => {
            itinerary = itinerary.replace(point, `[${point}](https://www.google.com/search?q=${encodeURIComponent(point + ' ' + request.city)})`)
        })

        setItinerary(itinerary)
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
            <Header title="ChatGPT 💙 Tripian" />
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
                                    }))} />
                                    <Input placeholder="Days" onChange={e => setRequest(request => ({
                                        ...request, days: e.target.value
                                    }))} />
                                    <Button className="input-button"  onClick={hitAPI}>
                                        {
                                            loading ?
                                                <Loading type="points" color="currentColor" size="sm" />
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
            <Spacer y={1} />
            <Row gap={1}>

                <Col>


                    <Grid.Container gap={10} justify="center">
                        <Grid>
                            {
                                loading && (
                                    <Loading color="secondary" textColor="secondary"
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
                            <Text h6 size={15} color="white" css={{ m: 0 }}>
                                {
                                    itinerary && days.map((day, index) => (
                                        // <p
                                        //   key={index}
                                        //   style={{marginBottom: '20px'}}
                                        //   dangerouslySetInnerHTML={{__html: `Day ${day}`}}
                                        // />
                                        <div
                                            style={{marginBottom: '30px'}}
                                            key={index}
                                        >
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: props => {
                                                        return <a target="_blank" rel="noopener noreferrer" href={props.href}>{props.children}</a>
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
                    </Grid.Container>
                </Col>
            </Row>

        </Container>
    );

}
