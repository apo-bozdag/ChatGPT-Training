import React, {useState} from 'react';
import {GoogleMap, LoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import {param} from "./../constants";
import {Button, Card, Col, Row, Text} from '@nextui-org/react';

const MapContainer = ({locations}) => {

    const mapStyles = {
        height: "100vh",
        width: "100%"
    };

    const [selected, setSelected] = useState({
        location: undefined,
        name: undefined,
        place_id: undefined,
        image: undefined
    });

    const onSelect = item => {
        console.log('item', item)
        setSelected(item);
    }

    return (
        <LoadScript
            googleMapsApiKey={param.GOOGLE_MAP_KEY}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                onLoad={(map) => {
                    const bounds = new window.google.maps.LatLngBounds();
                    locations.forEach((location) => {
                        bounds.extend({lat: parseFloat(location.location.lat), lng: parseFloat(location.location.lng)});
                    })
                    map.fitBounds(bounds);
                }}>
                {
                    locations && Object.keys(locations).map((key) => {
                        // key +1 because we want to start with 1
                        let label = parseInt(key) + 1;
                        const location = locations[key];
                        return (
                            <Marker key={location.name}
                                    label={label.toString()}
                                    position={location.location}
                                    onClick={() => onSelect(location)}
                            />
                        )
                    })
                }
                {
                    selected.location &&
                    (

                        <InfoWindow
                            options={{pixelOffset: new window.google.maps.Size(0, -30)}}
                            position={selected.location}
                            onCloseClick={() => setSelected({
                                location: undefined,
                                name: undefined,
                                place_id: undefined,
                                image: undefined
                            })}
                            onUnmount={() => setSelected({
                                location: undefined,
                                name: undefined,
                                place_id: undefined,
                                image: undefined
                            })
                            }
                        >
                            <Card css={{w: "300px", h: "200px"}}>
                                <Card.Header css={{position: "absolute", zIndex: 1, top: 5}}>
                                    <Col>
                                        <Text h3 color="white"
                                              css={{backgroundColor: "#00000066", borderRadius: 8, padding: 8}}>
                                            {selected.name}
                                        </Text>
                                    </Col>
                                </Card.Header>
                                <Card.Body css={{p: 0}}>
                                    <Card.Image
                                        src={selected.image ? selected.image : "https://artessere.com/upload/gallery/20552/17200-vyqefnmxoc-1920.jpg"}
                                        objectFit="cover"
                                        width="100%"
                                        height="100%"
                                        alt={selected.name}
                                    />
                                </Card.Body>
                                <Card.Footer
                                    isBlurred
                                    css={{
                                        position: "absolute",
                                        bgBlur: "#0f111466",
                                        borderTop: "$borderWeights$light solid $gray800",
                                        bottom: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <Row>
                                        <Col>
                                            <Row align="center">
                                                <Col span={3}>
                                                    <Card.Image
                                                        src="https://tripian.com/favicon.ico"
                                                        height={40}
                                                        width={40}
                                                        alt="tripian app icon"
                                                    />
                                                </Col>
                                                <Col>
                                                    <Text color="#d1d1d1" size={12}>
                                                        Tripian
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row justify="flex-end">
                                                <Button
                                                    flat
                                                    auto
                                                    rounded
                                                    onClick={() => {
                                                        window.open(`https://trial-dev.tripian.com/place/${selected.place_id}`, "_blank")
                                                    }
                                                    }
                                                    css={{color: "#94f9f0", bg: "#94f9f026"}}
                                                >
                                                    <Text
                                                        css={{color: "inherit"}}
                                                        size={12}
                                                        weight="bold"
                                                        transform="uppercase"
                                                    >
                                                        Detail
                                                    </Text>
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </InfoWindow>
                    )
                }
            </GoogleMap>
        </LoadScript>
    )
}
export default React.memo(MapContainer);
