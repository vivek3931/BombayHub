"use client";
import { useEffect } from 'react';
import { useLocation } from './LocationProvider';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MUMBAI_COORDS: [number, number] = [19.0760, 72.8777];
const LANDMARKS = [
    { name: "Gateway of India", lat: 18.9220, lng: 72.8347, desc: "Arch monument built in the 20th century." },
    { name: "Chhatrapati Shivaji Terminus", lat: 18.9398, lng: 72.8354, desc: "Historic railway station and UNESCO World Heritage Site." },
    { name: "Marine Drive", lat: 18.944, lng: 72.823, desc: "3.6-kilometre-long boulevard." },
    { name: "Haji Ali Dargah", lat: 18.9827, lng: 72.8089, desc: "Mosque and dargah located on an islet." },
    { name: "Bandra-Worli Sea Link", lat: 19.0300, lng: 72.8150, desc: "Cable-stayed bridge utilizing pre-stressed concrete-steel viaducts." }
];

const AREA_COORDS: Record<string, [number, number]> = {
    "All Mumbai": [19.0760, 72.8777],
    "Andheri": [19.1136, 72.8697],
    "Bandra": [19.0596, 72.8295],
    "Borivali": [19.2312, 72.8567],
    "Powai": [19.1176, 72.9060],
    "Navi Mumbai": [19.0330, 73.0297],
    "Colaba": [18.9067, 72.8147],
    "Dadar": [19.0178, 72.8478],
    "Juhu": [19.1075, 72.8263]
};

const MapController = ({ customCoords, customZoom }: { customCoords?: [number, number], customZoom?: number }) => {
    const map = useMap();
    const { location } = useLocation();

    useEffect(() => {
        if (customCoords && !isNaN(customCoords[0]) && !isNaN(customCoords[1])) {
            map.flyTo(customCoords, customZoom || 13, { duration: 1.5 });
            map.invalidateSize();
            return;
        }

        const coords = AREA_COORDS[location] || AREA_COORDS["All Mumbai"];
        const zoom = location === "All Mumbai" ? 11 : 14;
        map.flyTo(coords, zoom, { duration: 1.5 });
        map.invalidateSize();
    }, [map, location, customCoords, customZoom]);

    return null;
};

interface LeafletMapProps {
    coordinates?: [number, number];
    zoom?: number;
}

const LeafletMap = ({ coordinates, zoom }: LeafletMapProps) => {
    const isFocusMode = !!coordinates;

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={coordinates || MUMBAI_COORDS}
                zoom={zoom || 11}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                style={{ background: '#111', minHeight: '300px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController customCoords={coordinates} customZoom={zoom} />

                {/* Show Landmarks ONLY if NOT in focus mode */}
                {!isFocusMode && LANDMARKS.map((landmark, idx) => (
                    <Marker
                        key={idx}
                        position={[landmark.lat, landmark.lng]}
                        icon={customIcon}
                    >
                        <Popup className="leaflet-popup-custom">
                            <div className="text-asphalt-black">
                                <h3 className="font-heading text-lg font-bold">{landmark.name}</h3>
                                <p className="text-sm font-sans">{landmark.desc}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Show Focus Circle if in focus mode */}
                {isFocusMode && coordinates && (
                    <Circle
                        center={coordinates}
                        pathOptions={{
                            color: '#FFD700', // Taxi yellow
                            fillColor: '#FFD700',
                            fillOpacity: 0.1,
                            weight: 1
                        }}
                        radius={2000}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
