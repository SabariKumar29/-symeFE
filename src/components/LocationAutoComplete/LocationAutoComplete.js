import React, { useState, useRef, useEffect } from "react";
import {
  StandaloneSearchBox,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const libraries = ["places"];

const LocationAutoComplete = ({
  setLocation,
  value,
  setFilterLocation,
  showMapOnly = false, // Flag to toggle between autocomplete and map display
  lat = 0, // Latitude for map display
  lng = 0, // Longitude for map display
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [searchBox, setSearchBox] = useState(null);
  const searchBoxRef = useRef(null);

  // Effect to handle value updates for autocomplete
  useEffect(() => {
    if (value?.locationName) {
      searchBoxRef.current = { value: value?.locationName || null };
    }
  }, [value]);

  useEffect(() => {
    if (searchBox && searchBoxRef?.current?.value) {
      value.locationName = searchBoxRef.current.value || null;
      searchBoxRef.current.value = value?.locationName || null; // Clear the input
    }
  }, [searchBox]);

  // Handle the places changed event for autocomplete
  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      const addressComponents = place.address_components;
      const locationName = [];
      const location = {
        coordinates: { latitude: 0, longitude: 0 },
        locationName: "",
      };

      const newAddress = {
        street_number: "",
        route: "",
        locality: "",
        administrative_area_level_1: "",
        postal_code: "",
      };

      location.coordinates.latitude = places[0]?.geometry?.location?.lat() || 0;
      location.coordinates.longitude =
        places[0]?.geometry?.location?.lng() || 0;
      addressComponents?.forEach((component) => {
        const types = component.types;
        if (types.includes("street_number")) {
          locationName.push(component?.long_name);
          newAddress.street_number = component.long_name;
        }
        if (types.includes("route")) {
          locationName.push(component?.long_name);
          newAddress.route = component.long_name;
        }
        if (types.includes("locality")) {
          locationName.push(component?.long_name);
        }
        if (types.includes("administrative_area_level_1")) {
          locationName.push(component?.long_name);
          newAddress.locality = component.long_name;
        }
        if (types.includes("postal_code")) {
          newAddress.postal_code = component.long_name;
        }
      });

      setFilterLocation && setFilterLocation(newAddress);
      setLocation({ ...location, locationName: locationName.join(",") });
    } else {
      console.error("No places found");
    }
  };

  // Render logic based on showMapOnly flag
  return isLoaded ? (
    <>
      {!showMapOnly ? (
        // Autocomplete mode: show input
        <StandaloneSearchBox
          onLoad={(ref) => setSearchBox(ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Location"
            value={value?.locationName || ""}
            onChange={(e) =>
              setLocation({ ...value, locationName: e.target.value })
            }
            style={{
              boxSizing: "border-box",
              border: "none",
              width: "100%",
              height: "32px",
              fontSize: "14px",
              outline: "none",
              textOverflow: "ellipsis",
            }}
          />
        </StandaloneSearchBox>
      ) : (
        // Map mode: show map with marker at provided lat/lng
        <GoogleMap
          center={{ lat: lat || 0, lng: lng || 0 }}
          zoom={12}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          <Marker position={{ lat, lng }} />
        </GoogleMap>
      )}
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default LocationAutoComplete;
