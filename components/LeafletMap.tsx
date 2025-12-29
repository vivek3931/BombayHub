"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const MapController = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
};

const LeafletMap = () => {
    return (
        <div className="w-full h-full">
            <MapContainer
                center={MUMBAI_COORDS}
                zoom={11}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
                style={{ background: '#111' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapController />
                {LANDMARKS.map((landmark, idx) => (
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
            </MapContainer>
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(4px);
                    border-radius: 8px;
                    border: 1px solid #FFD600;
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.9);
                }
            `}</style>
        </div>
    );
};

export default LeafletMap;
