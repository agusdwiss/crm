"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface MapViewProps {
    latitude: number;
    longitude: number;
    popupText?: string;
}

export default function MapView({ latitude, longitude, popupText }: MapViewProps) {
    const position: [number, number] = [latitude, longitude];

    return (
        <div className="h-[400px] w-full rounded-md border overflow-hidden">
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    {popupText && <Popup>{popupText}</Popup>}
                </Marker>
            </MapContainer>
        </div>
    );
}
