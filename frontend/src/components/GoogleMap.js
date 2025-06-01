import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBkTAnXbWlp9B2trwhomG2Sx8mTGqY-vBQ';

// Singleton pattern for script loading
let googleMapsPromise = null;

const loadGoogleMapsScript = () => {
    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        // If Google Maps is already loaded, resolve immediately
        if (window.google?.maps) {
            resolve(window.google.maps);
            return;
        }

        // Create a unique callback name
        const callbackName = 'googleMapsCallback_' + Math.random().toString(36).substr(2, 9);
        window[callbackName] = () => {
            resolve(window.google.maps);
            delete window[callbackName];
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=${callbackName}&loading=async`;
        script.async = true;
        script.onerror = () => {
            reject(new Error('Failed to load Google Maps'));
            delete window[callbackName];
            googleMapsPromise = null;
        };
        document.head.appendChild(script);
    });

    return googleMapsPromise;
};

const getErrorMessage = (status) => {
    const errorMessages = {
        'ZERO_RESULTS': 'No location found for this address',
        'OVER_QUERY_LIMIT': 'Too many requests, please try again later',
        'REQUEST_DENIED': 'The Geocoding service is not enabled for this API key. Please enable it in the Google Cloud Console.',
        'INVALID_REQUEST': 'Invalid address provided',
        'ERROR': 'Server error, please try again later',
        'UNKNOWN_ERROR': 'An unknown error occurred'
    };
    return errorMessages[status] || 'Could not find the location on the map';
};

const GoogleMap = ({ address, city, state }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [mapError, setMapError] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const initializeMap = async () => {
            try {
                const maps = await loadGoogleMapsScript();

                if (!isMounted) return;

                // First create the map without geocoding
                const newMap = new maps.Map(mapRef.current, {
                    zoom: 15,
                    center: { lat: 20.5937, lng: 78.9629 }, // Default to center of India
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                    ]
                });

                setMap(newMap);

                const geocoder = new maps.Geocoder();
                const fullAddress = `${address}, ${city}, ${state}`;

                const geocodeResult = await new Promise((resolve, reject) => {
                    geocoder.geocode({ address: fullAddress }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            resolve(results[0]);
                        } else {
                            reject(new Error(getErrorMessage(status)));
                        }
                    });
                });

                if (!isMounted) return;

                const location = geocodeResult.geometry.location;
                newMap.setCenter(location);
                newMap.setZoom(15);

                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }

                markerRef.current = new maps.Marker({
                    map: newMap,
                    position: location,
                    animation: maps.Animation.DROP
                });

                const infoWindow = new maps.InfoWindow({
                    content: `
                        <div style="padding: 8px;">
                            <p style="margin: 0; font-weight: 500;">Shipping address</p>
                            <p style="margin: 5px 0 0; color: #666;">${address}</p>
                            <p style="margin: 5px 0 0; color: #666;">${city}, ${state}</p>
                        </div>
                    `
                });

                infoWindow.open(newMap, markerRef.current);

                markerRef.current.addListener('click', () => {
                    infoWindow.open(newMap, markerRef.current);
                });

            } catch (error) {
                console.error('Map initialization error:', error);
                if (isMounted) {
                    setMapError(error.message);
                }
            }
        };

        initializeMap();

        return () => {
            isMounted = false;
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        };
    }, [address, city, state]);

    if (mapError) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 'inherit',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666'
                }}
            >
                <p>{mapError}</p>
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            style={{
                width: '100%',
                height: '100%',
                borderRadius: 'inherit'
            }}
        />
    );
};

export default GoogleMap; 