import { Button, TextField, MenuItem, Grid, Typography, Dialog, DialogContent } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify"; // Importar toast
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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

function ClickMarker({ setFormData, initialPosition }) {
    const [position, setPosition] = useState(
        Array.isArray(initialPosition) && initialPosition.length === 2
            ? initialPosition
            : null
    );

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
                setFormData(f => ({
                    ...f,
                    latitude: lat,
                    longitude: lng,
                    island: null
                }));
            }
        }
    });

    useEffect(() => {
        if (Array.isArray(initialPosition) && initialPosition.length === 2) {
            setPosition(initialPosition);
        } else {
            setPosition(null);
        }
    }, [initialPosition]);

    if (!Array.isArray(position) || position.length !== 2) return null;

    return (
        <Marker position={position}>
            <Popup>
                Marcador añadido<br />
                Lat: {typeof position[0] === "number" ? position[0].toFixed(5) : ""} <br />
                Lng: {typeof position[1] === "number" ? position[1].toFixed(5) : ""}
            </Popup>
        </Marker>
    );
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
    const { t } = useTranslation();

    const [errors, setErrors] = useState({
        image: "",
        island: ""
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = { image: "", island: "" };
        let hasError = false;

        if (!formData.previewUrl && !formData.nameFile) {
            newErrors.image = t('form_error_image');
            hasError = true;
        }

        if (!formData.island || formData.island === "Desconocida") {
            newErrors.island = t('form_error_island');
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        setSubmitting(true);
        onSubmit(e);
    };

    const initialMarkerPosition =
        formData.latitude && formData.longitude
            ? [formData.latitude, formData.longitude]
            : null;

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogContent>
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 4, mt: 2 }}>
                    {editingIncident ? t('form_edit_incident') : t('form_new_incident')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} direction="column">
                        {/* Name */}
                        <Grid item>
                            <TextField fullWidth label={t('form_name')} name="name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
                        </Grid>
                        {/* Description */}
                        <Grid item>
                            <TextField fullWidth label={t('form_description')} name="description" multiline rows={3} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required />
                        </Grid>
                        {/* Area */}
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label={t('form_area')}
                                name="area"
                                value={formData.area || ''}
                                onChange={e => setFormData(f => ({ ...f, area: e.target.value }))
                                }
                                required
                            >
                                <MenuItem value="movilidad">{t('form_area_mobility')}</MenuItem>
                                <MenuItem value="sensorial">{t('form_area_sensory')}</MenuItem>
                                <MenuItem value="arquitectura">{t('form_area_architecture')}</MenuItem>
                                <MenuItem value="transporte">{t('form_area_transport')}</MenuItem>
                                <MenuItem value="otro">{t('form_area_other')}</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Type */}
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                label={t('form_type')}
                                name="incidentTypeId"
                                value={formData.incidentTypeId}
                                onChange={e => {
                                    const newVal = Number(e.target.value);
                                    setFormData(f => ({ 
                                        ...f, 
                                        incidentTypeId: newVal,
                                        incidentSeverityId: newVal === 1 ? null : f.incidentSeverityId,
                                        incidentStatusId: newVal === 1 ? 3 : 1
                                    }));
                                }}
                                required
                            >
                                <MenuItem value={1}>{t('form_good_practice')}</MenuItem>
                                <MenuItem value={2}>{t('form_bad_practice')}</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Severity (only if Bad Practice) */}
                        {formData.incidentTypeId === 2 && (
                            <Grid item>
                                <TextField
                                    select
                                    fullWidth
                                    label={t('form_severity')}
                                    name="incidentSeverityId"
                                    value={formData.incidentSeverityId ? Number(formData.incidentSeverityId) : ''}
                                    onChange={e => setFormData(f => ({ ...f, incidentSeverityId: Number(e.target.value) }))
                                    }
                                    required
                                >
                                    <MenuItem value={1}>{t('form_severity_low')}</MenuItem>
                                    <MenuItem value={2}>{t('form_severity_medium')}</MenuItem>
                                    <MenuItem value={3}>{t('form_severity_high')}</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                        {/* Date */}
                        <Grid item>
                            <TextField
                                fullWidth
                                label={t('form_date')}
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

                                    <ClickMarker setFormData={setFormData} initialPosition={initialMarkerPosition} />
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
                                {formData.previewUrl || formData.nameFile ? t('form_change_image') : t('form_upload_image')}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    name="image" 
                                    hidden 
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData(f => ({ 
                                                ...f, 
                                                image: file,
                                                previewUrl: URL.createObjectURL(file) 
                                            }));
                                        }
                                    }} 
                                />
                            </Button>
                        </Grid>

                        {errors.image && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {errors.image}
                            </Typography>
                        )}

                        {/* Image preview */}
                        {(formData.previewUrl || formData.nameFile) && (
                            <Grid item textAlign="center">
                                <img 
                                    src={
                                        formData.previewUrl || 
                                        (typeof formData.nameFile === 'string' ? formData.nameFile : '') || 
                                        ''
                                    } 
                                    alt="Preview" 
                                    style={{ 
                                        width: "100%", 
                                        maxWidth: "400px", 
                                        maxHeight: "250px", 
                                        objectFit: "contain", 
                                        borderRadius: "8px", 
                                        margin: "10px auto",
                                        display: "block"
                                    }} 
                                />
                            </Grid>
                        )}
                        {/* Buttons */}
                        <Grid item>
                            <Button variant="contained" color="success" type="submit" fullWidth sx={{ mt: 2 }}>
                                {submitting
                                    ? (editingIncident ? t('form_updating') : t('form_creating'))
                                    : (editingIncident ? t('form_update_incident') : t('form_create_incident'))}
                            </Button>
                            {onCancel && (
                                <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onCancel}>
                                    {t('cancel')}
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
