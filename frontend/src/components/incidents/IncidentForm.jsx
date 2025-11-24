import { Button, TextField, MenuItem, Grid, Typography, Dialog, DialogContent } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import axios from "axios";

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

function getIslandFromPostalCode(postalCode) {
    const code = parseInt(postalCode, 10);
    if (code >= 35000 && code <= 35999) return "Gran Canaria";
    if (code >= 35500 && code <= 35599) return "Lanzarote";
    if (code >= 35600 && code <= 35699) return "Fuerteventura";
    if (code >= 38000 && code <= 38999) return "Tenerife";
    if (code >= 38700 && code <= 38799) return "La Palma";
    if (code >= 38800 && code <= 38899) return "La Gomera";
    if (code >= 38900 && code <= 38999) return "El Hierro";
    return "Desconocida";
}

async function reverseGeocode(latitude, longitude) {
    try {
        const responseNominatin = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json",
                    addressdetails: 1,
                },
            }
        );
        return responseNominatin.data;
    } catch (err) {
        console.error("Error in geocoding:", err.message);
        return null;
    }
}

function ClickMarker({ setFormData }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const result = await reverseGeocode(lat, lng);
                const postalCode = result.address.postcode;
                const island = getIslandFromPostalCode(postalCode);

                setFormData(f => ({
                    ...f,
                    latitude: lat,
                    longitude: lng,
                    island: island,
                }));
            } catch (error) {
                console.error("Error in reverse geocoding:", error);
                setFormData(f => ({
                    ...f,
                    latitude: lat,
                    longitude: lng,
                    island: null
                }));
            }
        }
    });

    return position ? (
        <Marker position={position}>
            <Popup>
                Marcador añadido<br />
                Lat: {position[0].toFixed(5)} <br />
                Lng: {position[1].toFixed(5)}
            </Popup>
        </Marker>
    ) : null;
}

const IncidentForm = ({
    formData,
    setFormData,
    onSubmit,
    editingIncident,
    onCancel,
    open,
    setOpen,
}) => {

    const [errors, setErrors] = useState({
        image: "",
        island: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = { image: "", island: "" };
        let hasError = false;

        if (!formData.imageFile && !formData.previewUrl) {
            newErrors.image = "Debes subir una imagen antes de continuar.";
            hasError = true;
        }

        if (!formData.island || formData.island === "Desconocida") {
            newErrors.island = "No se pudo detectar correctamente la isla. Selecciona un punto válido en el mapa.";
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        setSubmitting(true);
        onSubmit(e);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogContent>
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 4, mt: 2 }}>
                    {editingIncident ? "Editar Incidencia" : "Nuevo Incidencia"}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} direction="column">
                        {/* Name */}
                        <Grid item>
                            <TextField fullWidth label="Nombre" name="title" value={formData.title} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
                        </Grid>
                        {/* Description */}
                        <Grid item>
                            <TextField fullWidth label="Descripción" name="description" multiline rows={3} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required />
                        </Grid>
                        {/* Area */}
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label="Area"
                                name="area"
                                value={formData.area}
                                onChange={e => setFormData(f => ({ ...f, area: e.target.value }))}
                                required
                            >
                                <MenuItem value={1}>movilidad</MenuItem>
                                <MenuItem value={2}>sensorial</MenuItem>
                                <MenuItem value={3}>arquitectura</MenuItem>
                                <MenuItem value={4}>transporte</MenuItem>
                                <MenuItem value={5}>otro</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Status */}
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                name="incidentStatusId"
                                value={formData.incidentStatusId}
                                onChange={e => setFormData(f => ({ ...f, incidentStatusId: Number(e.target.value) }))}
                                required
                            >
                                <MenuItem value={1}>Pendiente</MenuItem>
                                <MenuItem value={2}>En progreso</MenuItem>
                                <MenuItem value={3}>Resuelto</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Type */}
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label="Tipo"
                                name="incidentTypeId"
                                value={formData.incidentTypeId}
                                onChange={e => setFormData(f => ({ ...f, incidentTypeId: Number(e.target.value) }))}
                                required
                            >
                                <MenuItem value={1}>Buena Practica</MenuItem>
                                <MenuItem value={2}>Mala Practica</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Severity (only if Bad Practice) */}
                        {formData.incidentTypeId === 2 && (
                            <Grid item>
                                <TextField
                                    select
                                    fullWidth
                                    label="Severidad"
                                    name="incidentSeverityId"
                                    value={formData.incidentSeverityId}
                                    onChange={e => setFormData(f => ({ ...f, incidentSeverityId: Number(e.target.value) }))}
                                    required
                                >
                                    <MenuItem value={1}>Baja</MenuItem>
                                    <MenuItem value={2}>Media</MenuItem>
                                    <MenuItem value={3}>Alta</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                        {/* Date */}
                        <Grid item>
                            <TextField
                                fullWidth
                                label="Fecha"
                                name="dateIncident"
                                type="date"
                                value={formData.dateIncident}
                                onChange={e => setFormData(f => ({ ...f, dateIncident: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        {/* Map */}
                        <Grid item>
                            <div className="mx-auto w-full h-100 border-2 border-black rounded-lg overflow-hidden">
                                <MapContainer
                                    className="h-full w-full z-0"
                                    center={[28.5, -15.5]}
                                    zoom={8}
                                    minZoom={8}
                                    maxZoom={18}
                                    maxBounds={canariasBounds}
                                    maxBoundsViscosity={1}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap contributors'
                                    />

                                    <ClickMarker setFormData={setFormData} />
                                </MapContainer>
                            </div>

                            {errors.island && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {errors.island}
                                </Typography>
                            )}
                        </Grid>
                        {/* Image */}
                        <Grid item>
                            <Button variant="outlined" component="label" startIcon={<PhotoCamera />} fullWidth>
                                {formData.previewUrl ? "Cambiar Imagen" : "Subir Imagen"}
                                <input type="file" accept="image/*" name="imageFile" hidden onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) setFormData(f => ({ ...f, imageFile: file, previewUrl: URL.createObjectURL(file) }));
                                }} />
                            </Button>
                        </Grid>

                        {errors.image && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {errors.image}
                            </Typography>
                        )}

                        {/* Image preview */}
                        {formData.previewUrl && (
                            <Grid item textAlign="center">
                                <img src={formData.previewUrl} alt="Preview" style={{ width: "100%", maxWidth: 400, borderRadius: "8px", marginTop: "10px" }} />
                            </Grid>
                        )}
                        {/* Buttons */}
                        <Grid item>
                            <Button variant="contained" color="success" type="submit" fullWidth sx={{ mt: 2 }}>
                                {submitting
                                    ? (editingIncident ? "Actualizando..." : "Creando...")
                                    : (editingIncident ? "Actualizar Incidencia" : "Crear Incidencia")}
                            </Button>
                            {onCancel && (
                                <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onCancel}>
                                    Cancelar
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default IncidentForm;
