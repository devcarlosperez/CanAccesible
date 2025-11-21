import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { getAllIncidents } from "../../services/incidentService";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const canariasBounds = [
    [27.5, -18.5],
    [29.5, -13.0],
];

const Map = () => {
    const [incidents, setIncidents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllIncidents().then(setIncidents);
    }, []);

    const handleViewDetails = (incidentId) => {
        navigate(`/incidents?incidentId=${incidentId}`);
    };

    return (
        <>
            <Header transparent={false} className="fixed z-50" />

            <div className="pt-40 p-8">
                <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
                    En este mapa puedes ver las incidencias
                </Typography>
                <div className="mx-auto w-full max-w-6xl h-140 border-2 border-black rounded-lg overflow-hidden">

                    <MapContainer className="h-full w-full z-0"
                        center={[28.5, -15.5]}
                        zoom={8}
                        minZoom={8}
                        maxZoom={18}
                        maxBounds={canariasBounds}
                        maxBoundsViscosity={1}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {incidents.map((incident) =>
                            incident.latitude && incident.longitude ? (
                                <Marker
                                    key={incident.id}
                                    position={[incident.latitude, incident.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{incident.name}</strong>
                                            <br/>
                                            <button
                                                className="mt-1 inline-block underline text-blue-600"
                                                onClick={() => handleViewDetails(incident.id)}
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ) : null
                        )}
                    </MapContainer>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Map;
