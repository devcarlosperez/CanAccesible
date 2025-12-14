import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { getAllIncidents } from "../../services/incidentService";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const canariasBounds = [
    [27.5, -18.5],
    [29.5, -13.0],
];

const Map = () => {
    const { t } = useTranslation();
    const [incidents, setIncidents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllIncidents().then((data) => {
            const approved = data.filter((incident) => incident.isApproved);
            setIncidents(approved);
        });
    }, []);

    const handleViewDetails = (incidentId) => {
        navigate(`/incidents/${incidentId}`);
    };

    return (
        <>
            <Header transparent={false} className="fixed z-50" />

            <main className="pt-40 p-8 bg-gray-200">
                <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-8 text-center" style={{ color: "var(--color-neutral-2)" }}>
                    {t('map_title')}
                </h1>
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
                                    icon={incident.incidentTypeId === 1 ? greenIcon : redIcon}
                                    alt={incident.name}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{incident.name}</strong>
                                            <br />
                                            <button
                                                className="mt-1 inline-block underline text-blue-600 cursor-pointer"
                                                onClick={() => handleViewDetails(incident.id)}
                                            >
                                                {t('view_details')}
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ) : null
                        )}
                    </MapContainer>
                </div>
            </main>

            <Footer />
        </>
    );
};

export default Map;
