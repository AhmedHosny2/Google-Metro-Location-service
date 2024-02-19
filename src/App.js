import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader, // a hoock give us the is_loaded stuff
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  LoadScript,
} from "@react-google-maps/api";
import { useState } from "react";
import customMarkerImage from "./train.png";
let id = 0;
const libraries2 = ["places"];
let f = 0;

let cur_location = { lat: 30.004040252614345, lng: 31.70042143719354 };
let test = { lat: 30.053892, lng: 31.240238 };

function App() {
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);

  function updateCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            cur_location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            test.lat = cur_location.latitude;
            test.lng = cur_location.longitude;
            console.log("GO GO GOOO !!! ", test);

            // console.log("Current location:", cur_location);
            resolve(cur_location);
          },
          function (error) {
            console.log("Error occurred while retrieving location:", error);
            reject(error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation is not supported"));
      }
    });
  }
  async function run() {
    cur_location = await updateCurrentLocation();
    test.lat = cur_location.latitude;
    test.lng = cur_location.longitude;
    // console.log("GO GO GOOO !!! ", test);
  }
  if (f === 0) {
    run();
    f = 1;
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries2,
  });
  const handleAddMarkerClick = () => {
    const newMarker = {
      position: {
        lat: test.lat,
        lng: test.lng,
      },
      id,
      icon: customMarkerImage,
    };
    id += 1;
    console.log("new loc ", test);
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  if (!isLoaded) {
    return <SkeletonText />;
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    // originRef.current.value = "";
    // destiantionRef.current.value = "";
  }
  const handleButtonClick = () => {
    window.location.href = "https://retrometro.vercel.app/";
  };
  async function calculateRoute() {
    const directionsService = new window.google.maps.DirectionsService();
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    const results = await directionsService.route({
      origin: start,
      destination: end,
      travelMode: window.google.maps.TravelMode.TRANSIT,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap
          center={test}
          zoom={15}
          options={{
            mapId: process.env.MAPID, // Specify the map ID here
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                elementType: "geometry",
                stylers: [
                  {
                    color: "#f5f5f5",
                  },
                ],
              },
              {
                elementType: "labels.icon",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#616161",
                  },
                ],
              },
              {
                elementType: "labels.text.stroke",
                stylers: [
                  {
                    color: "#f5f5f5",
                  },
                ],
              },
              {
                featureType: "administrative",
                stylers: [
                  {
                    visibility: "simplified",
                  },
                ],
              },
              {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#bdbdbd",
                  },
                ],
              },
              {
                featureType: "poi",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#eeeeee",
                  },
                ],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#757575",
                  },
                ],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#e5e5e5",
                  },
                ],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#9e9e9e",
                  },
                ],
              },
              {
                featureType: "road",
                stylers: [
                  {
                    visibility: "simplified",
                  },
                ],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#ffffff",
                  },
                ],
              },
              {
                featureType: "road.arterial",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#757575",
                  },
                ],
              },
              {
                featureType: "road.highway",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#dadada",
                  },
                ],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#616161",
                  },
                ],
              },
              {
                featureType: "road.local",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#9e9e9e",
                  },
                ],
              },
              {
                featureType: "transit",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "transit.line",
                stylers: [
                  {
                    color: "#fd3ed2",
                  },
                  {
                    visibility: "off",
                  },
                ],
              },
              {
                featureType: "transit.line",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#e5e5e5",
                  },
                ],
              },
              {
                featureType: "transit.station",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#eeeeee",
                  },
                ],
              },
              {
                featureType: "transit.station.rail",
                stylers: [
                  {
                    visibility: "on",
                  },
                ],
              },
              {
                featureType: "transit.station.rail",
                elementType: "labels.icon",
                stylers: [
                  {
                    color: "#da2c43",
                  },
                  {
                    weight: 3,
                  },
                ],
              },
              {
                featureType: "transit.station.rail",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#da2c43",
                  },
                ],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                  {
                    color: "#c9c9c9",
                  },
                ],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [
                  {
                    color: "#9e9e9e",
                  },
                ],
              },
            ],
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }} // this is the map size
          onLoad={(map) => setMap(map)}
        >
          {/* just putting the marker on the center */}
          {/* <Marker position={center2} /> */}
          {/* <Marker position={test} /> */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position} />
          ))}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <strong>Start: </strong>
            <select
              id="start"
              style={{
                // backgroundColor: "#CE5071",
                padding: "5px",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                width: "200px",
              }}
            >
              <option value="Helwan Metro Station, Helwan Sharkeya, Helwan, Cairo Governorate 4036440">
                Helwan
              </option>
              <option value="Ain Helwan Metro Station">Ain Helwan</option>
              <option value="Helwan University Metro Station">
                Helwan University
              </option>
              <option value="Wadi Hof Metro Station">Wadi Hof</option>
              <option value="Hadayek Helwan Metro Station">
                Hadayek Helwan
              </option>
              <option value="El-Maasara Metro Station">El-Maasara</option>
              <option value="Tora El-Asmant Metro Station">
                Tora El-Asmant
              </option>
              <option value="Kozzika Metro Station">Kozzika</option>
              <option value="Tora El-Balad Metro Station">Tora El-Balad</option>
              <option value="Sakanat El-Maadi Metro Station">
                Sakanat El-Maadi
              </option>
              <option value="Maadi Metro Station">Maadi</option>
              <option value="Hadayek El-Maadi Metro Station">
                Hadayek El-Maadi
              </option>
              <option value="Dar El-Salam Metro Station">Dar El-Salam</option>
              <option value="El-Zahraa' Metro Station">El-Zahraa'</option>
              <option value="Mar Girgis Metro Station">Mar Girgis</option>
              <option value="El-Malek El-Saleh Metro Station">
                El-Malek El-Saleh
              </option>
              <option value="Al-Sayeda Zeinab Metro Station">
                Al-Sayeda Zeinab
              </option>
              <option value="Saad Zaghloul Metro Station">Saad Zaghloul</option>
              <option value="Sadat Metro Station">Sadat</option>
              <option value="Nasser Metro Station">Nasser</option>
              <option value="Orabi Metro Station">Orabi</option>
              <option value="Al-Shohadaa Metro Station">Al-Shohadaa</option>
              <option value="Ghamra Metro Station">Ghamra</option>
              <option value="El-Demerdash Metro Station">El-Demerdash</option>
              <option value="Manshiet El-Sadr Metro Station">
                Manshiet El-Sadr
              </option>
              <option value="Kobri El-Qobba Metro Station">
                Kobri El-Qobba
              </option>
              <option value="Hammamat El-Qobba Metro Station">
                Hammamat El-Qobba
              </option>
              <option value="Saray El-Qobba Metro Station">
                Saray El-Qobba
              </option>
              <option value="Hadayeq El-Zaitoun Metro Station">
                Hadayeq El-Zaitoun
              </option>
              <option value="Helmeyet El-Zaitoun Metro Station">
                Helmeyet El-Zaitoun
              </option>
              <option value="El-Matareyya Metro Station">El-Matareyya</option>
              <option value="Ain Shams Metro Station">Ain Shams</option>
              <option value="Ezbet El-Nakhl Metro Station">
                Ezbet El-Nakhl
              </option>
              <option value="El-Marg Metro Station">El-Marg</option>
              <option value="New El-Marg Metro Station">New El-Marg</option>
              <option value="Shubra Metro Station">Shubra</option>
              <option value="Koleyet El Zeraa Metro Station">
                Koleyet El Zeraa
              </option>
              <option value="El Mazallat Metro Station">El Mazallat</option>
              <option value="El Khalafawi Metro Station">El Khalafawi</option>
              <option value="St. Teresa Metro Station">St. Teresa</option>
              <option value="Rod El Farag Metro Station">Rod El Farag</option>
              <option value="Massara Metro Station">Massara</option>
              <option value="Al-Shohadaa Metro Station">Al-Shohadaa</option>
            </select>

            {/* </div> */}
            {/* <Autocomplete options={{ bounds: defaultBounds }}>
                <Input type="text" placeholder="Origin" ref={originRef} />
              </Autocomplete> */}
          </Box>
          <Box flexGrow={1}>
            <strong>End: </strong>
            <select
              id="end"
              style={{
                // backgroundColor: "#CE5071",
                padding: "5px",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                width: "200px",
              }}
            >
              <option value="Helwan Metro Station, Helwan Sharkeya, Helwan, Cairo Governorate 4036440">
                Helwan
              </option>
              <option value="Ain Helwan Metro Station">Ain Helwan</option>
              <option value="Helwan University Metro Station">
                Helwan University
              </option>
              <option value="Wadi Hof Metro Station">Wadi Hof</option>
              <option value="Hadayek Helwan Metro Station">
                Hadayek Helwan
              </option>
              <option value="El-Maasara Metro Station">El-Maasara</option>
              <option value="Tora El-Asmant Metro Station">
                Tora El-Asmant
              </option>
              <option value="Kozzika Metro Station">Kozzika</option>
              <option value="Tora El-Balad Metro Station">Tora El-Balad</option>
              <option value="Sakanat El-Maadi Metro Station">
                Sakanat El-Maadi
              </option>
              <option value="Maadi Metro Station">Maadi</option>
              <option value="Hadayek El-Maadi Metro Station">
                Hadayek El-Maadi
              </option>
              <option value="Dar El-Salam Metro Station">Dar El-Salam</option>
              <option value="El-Zahraa' Metro Station">El-Zahraa'</option>
              <option value="Mar Girgis Metro Station">Mar Girgis</option>
              <option value="El-Malek El-Saleh Metro Station">
                El-Malek El-Saleh
              </option>
              <option value="Al-Sayeda Zeinab Metro Station">
                Al-Sayeda Zeinab
              </option>
              <option value="Saad Zaghloul Metro Station">Saad Zaghloul</option>
              <option value="Sadat Metro Station">Sadat</option>
              <option value="Nasser Metro Station">Nasser</option>
              <option value="Orabi Metro Station">Orabi</option>
              <option value="Al-Shohadaa Metro Station">Al-Shohadaa</option>
              <option value="Ghamra Metro Station">Ghamra</option>
              <option value="El-Demerdash Metro Station">El-Demerdash</option>
              <option value="Manshiet El-Sadr Metro Station">
                Manshiet El-Sadr
              </option>
              <option value="Kobri El-Qobba Metro Station">
                Kobri El-Qobba
              </option>
              <option value="Hammamat El-Qobba Metro Station">
                Hammamat El-Qobba
              </option>
              <option value="Saray El-Qobba Metro Station">
                Saray El-Qobba
              </option>
              <option value="Hadayeq El-Zaitoun Metro Station">
                Hadayeq El-Zaitoun
              </option>
              <option value="Helmeyet El-Zaitoun Metro Station">
                Helmeyet El-Zaitoun
              </option>
              <option value="El-Matareyya Metro Station">El-Matareyya</option>
              <option value="Ain Shams Metro Station">Ain Shams</option>
              <option value="Ezbet El-Nakhl Metro Station">
                Ezbet El-Nakhl
              </option>
              <option value="El-Marg Metro Station">El-Marg</option>
              <option value="New El-Marg Metro Station">New El-Marg</option>
              <option value="Shubra Metro Station">Shubra</option>
              <option value="Koleyet El Zeraa Metro Station">
                Koleyet El Zeraa
              </option>
              <option value="El Mazallat Metro Station">El Mazallat</option>
              <option value="El Khalafawi Metro Station">El Khalafawi</option>
              <option value="St. Teresa Metro Station">St. Teresa</option>
              <option value="Rod El Farag Metro Station">Rod El Farag</option>
              <option value="Massara Metro Station">Massara</option>
              <option value="Al-Shohadaa Metro Station">Al-Shohadaa</option>
            </select>
            {/* <Autocomplete  options={options}>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destiantionRef}
                />
              </Autocomplete> */}
          </Box>

          <ButtonGroup>
            <Button
              bg="#FF5D00"
              color="#eee"
              type="submit"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={handleButtonClick}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              updateCurrentLocation();
              handleAddMarkerClick();
              // addMarker(test);
              map.panTo(test);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
