"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

interface MapPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect, position }: { onLocationSelect: any, position: any }) {
    const map = useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<[number, number] | null>(
        latitude && longitude ? [latitude, longitude] : null
    );

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleLocationSelect = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
    };

    // Default center (Indonesia) if no position
    const defaultCenter: [number, number] = [-6.200000, 106.816666];

    return (
        <div className="h-[400px] w-full rounded-md border overflow-hidden">
            <MapContainer
                center={position || defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={handleLocationSelect} position={position} />
            </MapContainer>
        </div>
    );
}
