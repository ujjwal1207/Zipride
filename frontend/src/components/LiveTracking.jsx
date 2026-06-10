import React, { useState, useEffect, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Helper function to calculate distance between two coordinates in kilometers
const haversine_distance = (mk1, mk2) => {
  if (!mk1 || !mk2) return 0;
  var R = 6371.0710; // Radius of the Earth in kilometers
  var rlat1 = mk1.lat * (Math.PI / 180);
  var rlat2 = mk2.lat * (Math.PI / 180);
  var difflat = rlat2 - rlat1;
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180);

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
};

const LiveTracking = ({
  pickup,
  destination,
  onDistanceChange,
  onDistanceToPickupChange,
  authToken,
}) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [showPickupMarker, setShowPickupMarker] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  // Becomes true once the Google Maps JS API is actually available on window.
  const [mapsReady, setMapsReady] = useState(
    typeof window !== "undefined" && !!window.google?.maps
  );

  // Use the token the page explicitly provides; fall back to whatever is
  // stored. This avoids sending a stale user token on captain pages (or
  // vice-versa), which the auth middleware would reject.
  const token =
    authToken ||
    localStorage.getItem("captaintoken") ||
    localStorage.getItem("token");

  // Function to get coordinates from address strings
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE}/maps/get-coordinates`,
        {
          params: { address },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates for:", address, error);
      setErrorMsg(
        error.response?.status === 401
          ? "Map auth failed — please log in again."
          : "Couldn't locate the address on the map."
      );
      return null;
    }
  };

  // Fetch coordinates for pickup and destination addresses
  useEffect(() => {
    if (pickup) {
      getCoordinates(pickup).then(setPickupCoords);
    } else {
      setPickupCoords(null);
    }
    if (destination) {
      getCoordinates(destination).then(setDestinationCoords);
    } else {
      setDestinationCoords(null);
    }
  }, [pickup, destination]);

  // Fetch the route once coordinates AND the maps script are available.
  useEffect(() => {
    if (!mapsReady || !pickupCoords || !destinationCoords) {
      return;
    }
    if (!window.google?.maps) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setErrorMsg("");

          // Derive trip distance from the route so the UI isn't dependent
          // solely on live GPS updates.
          const leg = result.routes?.[0]?.legs?.[0];
          if (leg?.distance?.value != null && onDistanceChange) {
            onDistanceChange(leg.distance.value / 1000); // meters -> km
          }
        } else {
          console.error(`Error fetching directions: ${status}`);
          if (status === "REQUEST_DENIED") {
            setErrorMsg("Route unavailable — enable the Directions API for the key.");
          }
          // Fallback to a straight-line estimate so a number still shows.
          if (onDistanceChange) {
            onDistanceChange(
              haversine_distance(pickupCoords, destinationCoords)
            );
          }
        }
      }
    );
  }, [mapsReady, pickupCoords, destinationCoords, onDistanceChange]);

  // Watch live location of the captain/user
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        setCurrentPosition(newPos);

        if (pickupCoords) {
          const distanceToPickup = haversine_distance(newPos, pickupCoords);
          if (onDistanceToPickupChange) {
            onDistanceToPickupChange(distanceToPickup);
          }
          if (distanceToPickup < 0.02) {
            setShowPickupMarker(false);
          }
        }

        if (destinationCoords && onDistanceChange) {
          const distanceToDestination = haversine_distance(
            newPos,
            destinationCoords
          );
          onDistanceChange(distanceToDestination);
        }
      },
      (error) => console.error("Error getting location", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [pickupCoords, destinationCoords, onDistanceChange, onDistanceToPickupChange]);

  const handleMapLoad = useCallback(() => {
    if (window.google?.maps) setMapsReady(true);
  }, []);

  const mapCenter =
    currentPosition || pickupCoords || { lat: 20.5937, lng: 78.9629 };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setMapsReady(true)}
    >
      <div className="relative w-full h-full">
        {errorMsg && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md max-w-[90%] text-center">
            {errorMsg}
          </div>
        )}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
          onLoad={handleMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: true, preserveViewport: false }}
            />
          )}
          {pickupCoords && showPickupMarker && (
            <Marker position={pickupCoords} label="P" title="Pickup" />
          )}
          {destinationCoords && (
            <Marker position={destinationCoords} label="D" title="Destination" />
          )}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default LiveTracking;
